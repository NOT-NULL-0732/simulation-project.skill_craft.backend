import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BusinessException } from '@/common/exception/business.exception';
import {
  FILE_CONFIG,
  UPLOAD_FILE_SERVICE_KEY,
} from '@/common/config/file.config';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import db from '@/db';
import { fileSchema, FileSchemaWithStatus } from '@/db/schema/file.schema';
import path from 'path';
import * as uuid from 'uuid';
import { z } from 'zod';
import { UploadFileZSchema } from '@/modules/file/file.z-schema';
import { IAuthenticatedUser } from '@/common/types/express';
import { mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { RedisService } from '@/modules/redis/redis.service';
import { RedisAccessFileData } from '@/modules/file/file.type';

@Injectable()
export class FileService {
  constructor(private readonly redisService: RedisService) {}

  async uploadFile(
    body: z.infer<typeof UploadFileZSchema>,
    files: Express.Multer.File[],
    user: IAuthenticatedUser | null,
    userIP: string,
  ): Promise<string> {
    // 上传文件配置限制
    const UPLOAD_FILE_CONFIG = FILE_CONFIG[body.service];
    if (files.length > UPLOAD_FILE_CONFIG.limit)
      throw new BusinessException(
        ResponseStatusCode.UPLOAD_FILE__OVER_LIMIT_ERROR,
      );
    files.map((file) => {
      if (file.size > UPLOAD_FILE_CONFIG.maxSize)
        throw new BusinessException(
          ResponseStatusCode.UPLOAD_FILE__OVER_LIMIT_ERROR,
        );
    });
    // 保存文件
    const savePath = UPLOAD_FILE_SERVICE_KEY[body.service];
    const filesUUID = await db.transaction(async (tx) => {
      return Promise.all(
        files.map(async (file) => {
          const extraName = path.extname(file.originalname);
          if (!extraName)
            throw new BusinessException(
              ResponseStatusCode.UPLOAD_FILE__UNKNOW_FILE_EXTNAME,
            );
          const uploadDir = path.join(process.cwd(), 'uploads', savePath);
          try {
            mkdirSync(uploadDir, { recursive: true });
            const fileName = `${uuid.v7()}${extraName}`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, file.buffer);
            return tx
              .insert(fileSchema)
              .values({
                file_name: fileName,
                save_path: savePath,
                file_size: file.size.toString(),
                consumer_service: body.service,
                uploaded_by: user ? user.userId : null,
                status: FileSchemaWithStatus.UNUSE,
              })
              .returning({
                id: fileSchema.id,
              })
              .then((data) => data[0].id);
          } catch (error) {
            throw new BusinessException(
              ResponseStatusCode.UPLOAD_FILE__FILE_WRITE_ERROR,
            );
          }
        }),
      );
    });

    return this.setFilesWithRedis(filesUUID, userIP);
  }

  public async setFilesWithRedis(fileIds: string[], userIp: string) {
    const accessKey = uuid.v4();
    const compositeValue = JSON.stringify({
      userIp,
      fileIds,
    } as RedisAccessFileData);

    await this.redisService.redis.setex(
      `service:file:access:${accessKey}`,
      1000,
      compositeValue,
    );
    return accessKey;
  }

  public async getFiles(accessKey: string, userIP: string) {
    const stringData = await this.redisService.redis.getex(
      `service:file:access:${accessKey}`,
    );
    if (!stringData) throw Error('过期了');
    const jsonData = JSON.parse(stringData) as RedisAccessFileData;
    if (jsonData.userIp !== userIP)
      throw new UnauthorizedException('你为什么要偷别人的文件！！！');
    return jsonData;
  }
}
