import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { userSchema } from '@/db/schema/user.schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import {
  CreatePermissionZSchema,
  CreateRolePermissionZSchema,
  CreateRoleZSchema,
  CreateUserRoleZSchema,
  DeleteRolePermissionZSchema,
  DeleteUserRoleZSchema,
  LoginZSchema,
  RegisterZSchema,
} from '@/modules/auth/auth.z-schema';
// @ts-ignore
import { DrizzleQueryError } from 'drizzle-orm/errors';
import { roleSchema } from '@/db/schema/role.schema';
import { permissionSchema } from '@/db/schema/permission.schema';
import { userRoleSchema } from '@/db/schema/user-role.schema';
import { rolePermissionSchema } from '@/db/schema/role-permission.schema';
import db from '@/db';
import { CryptoService } from '@/modules/crypto/crypto.service';
import { LoginTokenData } from '@/modules/auth/auth.type';

@Injectable()
export class AuthService {
  constructor(private readonly cryptoService: CryptoService) {}

  _hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async register(data: z.infer<typeof RegisterZSchema>) {
    try {
      await db.insert(userSchema).values({
        user_name: data.user_name,
        password: this._hashPassword(data.password),
        email: data.email,
      });
    } catch (err: unknown) {
      if (err instanceof DrizzleQueryError && err) {
        throw new BusinessException(
          ResponseStatusCode.COMMON_INSERT_UNIQUE_ERROR,
          '用户名或邮箱重复',
        );
      }
    }
  }

  async login(data: z.infer<typeof LoginZSchema>) {
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
      user_name: updatedUser.user_name,
      user_token: updatedUser.user_token,
    };
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

  async getRoles() {
    return db.query.roleSchema.findMany();
  }

  async createRole(body: z.infer<typeof CreateRoleZSchema>): Promise<string> {
    const insertResult = await db
      .insert(roleSchema)
      .values({
        name: body.name,
        role_key: body.role_key,
        description: body.description,
      })
      .onConflictDoNothing({
        target: [roleSchema.role_key],
      })
      .returning({ id: roleSchema.id });
    if (insertResult.length === 0)
      throw new BusinessException(
        ResponseStatusCode.AUTH__ROLE_IDENTIFICATION_REPEAT_ERROR,
      );
    return insertResult[0].id;
  }

  async getPermissions() {
    return db.query.permissionSchema.findMany();
  }

  async createUserRole(body: z.infer<typeof CreateUserRoleZSchema>) {
    const insertResult = await db
      .insert(userRoleSchema)
      .values({
        ...body,
      })
      .onConflictDoNothing({
        target: [userRoleSchema.user_id, userRoleSchema.role_id],
      });
    if (insertResult.rowCount === 0)
      throw new BusinessException(
        ResponseStatusCode.AUTH__REPEAT_ADD_ROLE_WITH_USER_ERROR,
      );
  }

  async deleteUserRole(body: z.infer<typeof DeleteUserRoleZSchema>) {
    await db
      .delete(userRoleSchema)
      .where(
        and(
          eq(userRoleSchema.user_id, body.user_id),
          eq(userRoleSchema.role_id, body.role_id),
        ),
      );
  }

  async createRolePermission(
    body: z.infer<typeof CreateRolePermissionZSchema>,
  ) {
    const insertResult = await db
      .insert(rolePermissionSchema)
      .values({ ...body })
      .onConflictDoNothing({
        target: [
          rolePermissionSchema.role_id,
          rolePermissionSchema.permission_id,
        ],
      });
    if (insertResult.rowCount === 0)
      throw new BusinessException(
        ResponseStatusCode.AUTH__REPEAT_ADD_PERMISSION_WITH_ROLE_ERROR,
      );
  }

  async deleteRolePermission(
    body: z.infer<typeof DeleteRolePermissionZSchema>,
  ) {
    await db
      .delete(rolePermissionSchema)
      .where(
        and(
          eq(rolePermissionSchema.role_id, body.role_id),
          eq(rolePermissionSchema.permission_id, body.permission_id),
        ),
      );
  }

  async createPermission(
    body: z.infer<typeof CreatePermissionZSchema>,
  ): Promise<string> {
    const insertResult = await db
      .insert(permissionSchema)
      .values({
        name: body.name,
        permission_key: body.permission_key,
        description: body.description,
      })
      .onConflictDoNothing({
        target: [permissionSchema.permission_key],
      })
      .returning({ id: permissionSchema.id });
    if (insertResult.length === 0)
      throw new BusinessException(
        ResponseStatusCode.AUTH__PERMISSION_IDENTIFICATION_REPEAT_ERROR,
      );
    return insertResult[0].id;
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
