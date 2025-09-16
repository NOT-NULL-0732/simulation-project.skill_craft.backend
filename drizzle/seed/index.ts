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
      const [insertUserAdminResult] = await t
        .insert(userSchema)
        .values({
          username: '超级管理员',
          email: 'admin@example.com',
          password: authServer._hashPassword(defaultPassword),
        })
        .returning();
      const [insertUserTeacherResult] = await t
        .insert(userSchema)
        .values({
          username: '测试教师',
          email: 'teacher@example.com',
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
      const [insertTeacherResult] = await t
        .insert(roleSchema)
        .values({
          name: '教师',
          role_key: 'TEACHER',
          description: '教师，可以创建课程，以及课程模块下的各种操作',
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
        { permission_key: 'AUTH:USER:LOGIN', name: '登录' },
        { permission_key: 'COMMON:FILE:UPLOAD', name: '上传文件' },
      ];
      const TEACHER_PERMISSION_LIST = [
        { permission_key: 'COURSE:COURSE:CREATE', name: '添加课程' },
        { permission_key: 'COURSE:COURSE:UPDATE', name: '更改课程' },
        { permission_key: 'COURSE:COURSE:DELETE', name: '删除课程' },
        { permission_key: 'COURSE:COURSE:LIST', name: '查询课程' },
        { permission_key: 'COURSE:LESSON:LIST', name: '查询课程节点' },
        { permission_key: 'COURSE:LESSON:CREATE', name: '添加课程节点' },
        { permission_key: 'COURSE:LESSON:DELETE', name: '删除课程节点' },
        { permission_key: 'COURSE:LESSON:UPDATE', name: '更改课程节点' },
        {
          permission_key: 'COURSE:LESSON_RESOURCE:LIST',
          name: '查询课程节点资源',
        },
        {
          permission_key: 'COURSE:LESSON_RESOURCE:CREATE',
          name: '添加课程节点资源',
        },
        {
          permission_key: 'COURSE:LESSON_RESOURCE:DELETE',
          name: '删除课程节点资源',
        },
        {
          permission_key: 'COURSE:LESSON_RESOURCE:UPDATE',
          name: '更改课程节点资源',
        },
      ];
      const ADMIN_PERMISSION_LIST = [
        { permission_key: 'AUTH:USER:CREATE', name: '创建用户' },
        { permission_key: 'AUTH:USER:DELETE', name: '删除用户' },
        { permission_key: 'AUTH:USER:UPDATE', name: '更改用户' },
        { permission_key: 'AUTH:USER:LIST', name: '查询用户' },
        { permission_key: 'AUTH:ROLE:LIST', name: '查询角色' },
        { permission_key: 'AUTH:USER_ROLE:CREATE', name: '添加用户的角色' },
        { permission_key: 'AUTH:USER_ROLE:DELETE', name: '删除用户的角色' },
        { permission_key: 'AUTH:USER_ROLE:LIST', name: '查询用户的角色' },
      ];

      const insertGhostPermissionResult = await t
        .insert(permissionSchema)
        .values(GHOST_PERMISSION_LIST)
        .returning({
          id: permissionSchema.id,
        });
      const insertTeacherPermissionResult = await t
        .insert(permissionSchema)
        .values(TEACHER_PERMISSION_LIST)
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
      const insertRolePermissionFn = (
        roleId: string,
        ...permissionIdArray: { id: string }[][]
      ) => {
        return permissionIdArray.flat(1).map((permissionId) => ({
          permission_id: permissionId.id,
          role_id: roleId,
        }));
      };
      await t
        .insert(rolePermissionSchema)
        .values(
          insertRolePermissionFn(
            insertAdminRoleResult.id,
            insertAdminPermissionResult,
            insertTeacherPermissionResult,
            insertGhostPermissionResult,
          ),
        );
      await t
        .insert(rolePermissionSchema)
        .values(
          insertRolePermissionFn(
            insertTeacherResult.id,
            insertTeacherPermissionResult,
            insertGhostPermissionResult,
          ),
        );
      await t
        .insert(rolePermissionSchema)
        .values(
          insertRolePermissionFn(
            insertGhostRoleResult.id,
            insertGhostPermissionResult,
          ),
        );

      console.log('-> 初始化用户角色(userRoleSchema)中...');
      // 为用户插入角色
      await t.insert(userRoleSchema).values({
        user_id: insertUserAdminResult.id,
        role_id: insertAdminRoleResult.id,
      });
      await t.insert(userRoleSchema).values({
        user_id: insertUserTeacherResult.id,
        role_id: insertTeacherResult.id,
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
