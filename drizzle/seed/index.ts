import db from '@/db';
import { userSchema } from '@/db/schema/user.schema';
import { roleSchema } from '@/db/schema/role.schema';
import { userRoleSchema } from '@/db/schema/user-role.schema';
import { AuthService } from '@/modules/auth/auth.service';
import { permissionSchema } from '@/db/schema/permission.schema';
import { rolePermissionSchema } from '@/db/schema/role-permission.schema';
import { CryptoService } from '@/modules/crypto/crypto.service';

async function run() {
  const cryptoService = new CryptoService();
  const authServer = new AuthService(cryptoService);
  const defaultPassword = '12345678';
  try {
    console.log('-> 初始化数据库中...');
    await db.transaction(async (t) => {
      console.log('-> 初始化用户(userSchema)中...');
      // 初始化用户
      const [insertUserResult] = await t
        .insert(userSchema)
        .values({
          user_name: '超级管理员',
          email: 'admin@example.com',
          password: authServer._hashPassword(defaultPassword),
        })
        .returning();

      console.log('-> 初始化角色(roleSchema)中...');
      const [insertAdminRoleResult] = await t
        .insert(roleSchema)
        .values({
          name: '超级管理员',
          role_key: 'SUPER_ADMIN',
          description: '超级管理员，拥有所有权限',
        })
        .returning();
      const [insertGhostRoleResult] = await t
        .insert(roleSchema)
        .values({
          name: '游客',
          role_key: 'GHOST',
          description: '游客角色，没有令牌时的默认角色',
        })
        .returning();

      console.log('-> 初始化权限(permissionSchema)中...');

      const GHOST_PERMISSION_LIST = [
        { permission_key: 'AUTH:USER:REGISTER', name: '注册' },
        { permission_key: 'AUTH:USER:LOGIN', name: '登录' },
        { permission_key: 'COMMON:FILE:UPLOAD', name: '上传文件' },
      ];
      const ADMIN_PERMISSION_LIST = [
        { permission_key: 'AUTH:ROLE:GET', name: '获取角色' },
        { permission_key: 'AUTH:ROLE:ADD', name: '添加角色' },
        { permission_key: 'AUTH:ROLE:UPDATE', name: '更新角色' },
        { permission_key: 'AUTH:ROLE:DELETE', name: '删除角色' },
        { permission_key: 'AUTH:PERMISSION:GET', name: '获取权限' },
        { permission_key: 'AUTH:PERMISSION:ADD', name: '添加权限' },
        { permission_key: 'AUTH:PERMISSION:UPDATE', name: '更新权限' },
        { permission_key: 'AUTH:PERMISSION:DELETE', name: '删除权限' },
        { permission_key: 'AUTH:USER_ROLE:ADD', name: '添加用户角色' },
        { permission_key: 'AUTH:USER_ROLE:DELETE', name: '删除用户角色' },
        { permission_key: 'AUTH:ROLE_PERMISSION:ADD', name: '添加角色权限' },
        { permission_key: 'AUTH:ROLE_PERMISSION:DELETE', name: '删除角色权限' },
        { permission_key: 'COURSE:COURSE:CREATE', name: '创建课程' },
        { permission_key: 'COURSE:COURSE:UPDATE', name: '更新课程' },
        { permission_key: 'COURSE:COURSE:DELETE', name: '删除课程' },
      ];

      const insertGhostPermissionResult = await t
        .insert(permissionSchema)
        .values(GHOST_PERMISSION_LIST)
        .returning({
          id: permissionSchema.id,
        });
      const insertAdminPermissionResult = await t
        .insert(permissionSchema)
        .values(ADMIN_PERMISSION_LIST)
        .returning({
          id: permissionSchema.id,
        });

      console.log('-> 初始化角色权限(rolePermissionSchema)中...');
      await t.insert(rolePermissionSchema).values(
        insertGhostPermissionResult
          .concat(insertAdminPermissionResult)
          .map((item) => {
            return {
              role_id: insertAdminRoleResult.id,
              permission_id: item.id,
            };
          }),
      );
      await t.insert(rolePermissionSchema).values(
        insertGhostPermissionResult.map((item) => {
          return {
            role_id: insertGhostRoleResult.id,
            permission_id: item.id,
          };
        }),
      );

      console.log('-> 初始化用户角色(userRoleSchema)中...');
      // 为用户插入角色
      await t.insert(userRoleSchema).values({
        user_id: insertUserResult.id,
        role_id: insertAdminRoleResult.id,
      });
    });
  } catch (error) {
    console.error('初始化过程中出错:', error);
    throw error;
  }
}

(async () => {
  const date = new Date().getTime();
  console.log('数据库初始化开始');
  try {
    await run();
    console.log('数据库初始化完成');
    console.log('耗时:', new Date().getTime() - date, 'ms');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
