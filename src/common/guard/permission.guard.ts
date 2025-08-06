import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { userSchema } from '@/db/schema/user.schema';
import { userRoleSchema } from '@/db/schema/user-role.schema';
import { roleSchema } from '@/db/schema/role.schema';
import { rolePermissionSchema } from '@/db/schema/role-permission.schema';
import { permissionSchema } from '@/db/schema/permission.schema';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const permission_key: string = this.reflector.get(
      'permission_key',
      context.getHandler(),
    );
    if (!permission_key) return true;
    const request = context.switchToHttp().getRequest<Request>();

    let permission_key_list: string[];

    if (request.authenticatedUser) {
      const permissions = await db
        .selectDistinctOn([permissionSchema.permission_key], {
          permission_key: permissionSchema.permission_key,
        })
        .from(userSchema)
        .where(eq(userSchema.id, 1))
        .leftJoin(userRoleSchema, eq(userSchema.id, userRoleSchema.user_id))
        .leftJoin(roleSchema, eq(roleSchema.id, userRoleSchema.role_id))
        .leftJoin(
          rolePermissionSchema,
          eq(rolePermissionSchema.role_id, roleSchema.id),
        )
        .innerJoin(
          permissionSchema,
          eq(permissionSchema.id, rolePermissionSchema.permission_id),
        );
      permission_key_list = permissions.flatMap(
        (permission) => permission.permission_key,
      );
    } else {
      const permissions = await db
        .select({
          permission_key: permissionSchema.permission_key,
        })
        .from(roleSchema)
        .where(eq(roleSchema.name, 'ghost'))
        .leftJoin(
          rolePermissionSchema,
          eq(rolePermissionSchema.role_id, roleSchema.id),
        )
        .innerJoin(
          permissionSchema,
          eq(permissionSchema.id, rolePermissionSchema.permission_id),
        );
      permission_key_list = permissions.flatMap(
        (permission) => permission.permission_key,
      );
    }
    if (permission_key_list.includes(permission_key)) return true;
    throw new BusinessException(
      ResponseStatusCode.AUTH__PERMISSION_VALIDATOR_ERROR,
    );
  }
}
