import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { AppConfig } from '@/common/config/index.config';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';

@Injectable()
export class CryptoService {
  private authTagLength: number = 12;
  private ivLength: number = 12;
  private AAD: string = '额外的验证数据';

  // 加密
  encrypted(data: string): string {
    const iv = randomBytes(this.ivLength);
    const cipher = createCipheriv('aes-256-gcm', AppConfig.crypto.key, iv, {
      authTagLength: this.authTagLength,
    });
    cipher.setAAD(Buffer.from(this.AAD, 'utf-8'));
    const encryptedString = cipher.update(data, 'utf-8');
    const encryptedBuffer = Buffer.concat([encryptedString, cipher.final()]);
    return Buffer.concat([
      Buffer.from(iv),
      Buffer.from(cipher.getAuthTag()),
      encryptedBuffer,
    ]).toString('hex');
  }

  // 解密
  decrypted(body: string): string {
    try {
      const bodyBuffer = Buffer.from(body, 'hex');
      const iv = bodyBuffer.subarray(0, this.ivLength);
      const authTag = bodyBuffer.subarray(
        this.ivLength,
        this.ivLength + this.authTagLength,
      );
      const encryptedData = bodyBuffer.subarray(
        this.ivLength + this.authTagLength,
      );
      const decipher = createDecipheriv(
        'aes-256-gcm',
        AppConfig.crypto.key,
        iv,
        {
          authTagLength: this.authTagLength,
        },
      );
      decipher.setAAD(Buffer.from(this.AAD, 'utf-8'));
      decipher.setAuthTag(authTag);
      const decryptedString = decipher.update(encryptedData);
      const decryptedBuffer = Buffer.concat([
        decryptedString,
        decipher.final(),
      ]);
      return decryptedBuffer.toString('utf-8');
    } catch (e) {
      throw new BusinessException(
        ResponseStatusCode.COMMON__DECRYPTED_DATA_ERROR,
      );
    }
  }
}
