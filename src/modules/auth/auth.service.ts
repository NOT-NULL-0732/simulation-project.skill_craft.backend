import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { userSchema } from '@/db/schema/user.schema';
import { and, eq } from 'drizzle-orm';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import db from '@/db';
import { CryptoService } from '@/modules/crypto/crypto.service';
import { LoginTokenData, TypeServiceAuth } from '@/modules/auth/auth.type';
import { roleSchema } from '@/db/schema/role.schema';
import { userRoleSchema } from '@/db/schema/user-role.schema';

@Injectable()
export class AuthService {
  constructor(private readonly cryptoService: CryptoService) {}

  _hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async login(data: TypeServiceAuth['login']) {
    const user = await db.query.userSchema.findFirst({
      where: and(
        eq(userSchema.email, data.email),
        eq(userSchema.password, this._hashPassword(data.password)),
      ),
    });
    if (!user)
      throw new BusinessException(ResponseStatusCode.AUTH__PASSWORD_ERROR);
    const user_token = this._genRandomToken(user.id, Date.now());
    const updatedUsers = await db
      .update(userSchema)
      .set({ user_token })
      .where(eq(userSchema.id, user.id))
      .returning();
    const updatedUser = updatedUsers[0];
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      user_token: updatedUser.user_token,
    };
  }

  async createUser(data: TypeServiceAuth['user']['create']) {
    // TODO 插入用户没有重复性插入的错误处理
    const [insertUserResult] = await db
      .insert(userSchema)
      .values({
        ...data,
        password: this._hashPassword(data.password),
      })
      .returning({
        id: userSchema.id,
      });
    return {
      userId: insertUserResult.id,
    };
  }

  async deleteUser(data: TypeServiceAuth['user']['delete']) {
    await db.delete(userSchema).where(eq(userSchema.id, data.userId)).execute();
  }

  async listUser() {
    return await db
      .select({
        userId: userSchema.id,
        userUsername: userSchema.username,
        userCreatedAt: userSchema.created_at,
        userEmail: userSchema.email,
        role: {
          id: roleSchema.id,
          name: roleSchema.name,
        },
      })
      .from(userSchema)
      .leftJoin(userRoleSchema, eq(userRoleSchema.user_id, userSchema.id))
      .leftJoin(roleSchema, eq(roleSchema.id, userRoleSchema.role_id))
      .execute();
  }

  async listRole() {
    return await db
      .select({
        id: roleSchema.id,
        key: roleSchema.role_key,
        name: roleSchema.name,
        description: roleSchema.description,
      })
      .from(roleSchema)
      .execute();
  }

  async createUserRole(data: TypeServiceAuth['userRole']['create']) {
    await db.insert(userRoleSchema).values({
      user_id: data.userId,
      role_id: data.roleId,
    });
  }

  async deleteUserRole(data: TypeServiceAuth['userRole']['delete']) {
    await db
      .delete(userRoleSchema)
      .where(eq(userRoleSchema.id, data.userRoleId));
  }

  async validateUserToken(userToken?: string): Promise<string> {
    if (!userToken)
      throw new BusinessException(
        ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR,
      );
    const { userId, signDate } = JSON.parse(
      this.cryptoService.decrypted(userToken),
    ) as LoginTokenData;
    console.log(signDate, typeof signDate);

    // 计算过期;
    if (Date.now() - signDate > 1000 * 60 * 60 * 24 * 7)
      throw new BusinessException(ResponseStatusCode.AUTH__TOKEN_DATE_ERROR);
    const findResult = await db.query.userSchema.findFirst({
      where: and(
        eq(userSchema.id, userId),
        eq(userSchema.user_token, userToken),
      ),
    });
    if (!findResult)
      throw new BusinessException(
        ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR,
      );
    return userId;
  }

  private _genRandomToken(userId: string, date: number) {
    return this.cryptoService.encrypted(
      JSON.stringify({
        userId,
        signDate: date,
      } as LoginTokenData),
    );
  }
}
