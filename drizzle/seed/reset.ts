import db from '@/db';
import {
  lessonClassSchema,
  lessonNodeSchema,
  lessonSchema,
} from '@/db/schema/lesson.schema';
import { permissionSchema } from '@/db/schema/permission.schema';
import { roleSchema } from '@/db/schema/role.schema';
import { rolePermissionSchema } from '@/db/schema/role-permission.schema';
import { userRoleSchema } from '@/db/schema/user-role.schema';
import { userSchema } from '@/db/schema/user.schema';

async function run() {
  console.log('-> 清除数据库中...');
  await db.delete(lessonSchema);
  await db.delete(lessonNodeSchema);
  await db.delete(lessonClassSchema);
  await db.delete(permissionSchema);
  await db.delete(roleSchema);
  await db.delete(rolePermissionSchema);
  await db.delete(userRoleSchema);
  await db.delete(userSchema);
}

(async () => {
  const date = new Date().getTime();
  console.log('数据库清除开始');
  try {
    await run();
    console.log('数据库清除完成');
    console.log('耗时:', new Date().getTime() - date, 'ms');
  } catch (error) {
    console.error('数据库清除失败:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
