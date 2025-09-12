import db from '@/db';
import {
  courseClassSchema,
  courseClassStudentSchema,
  courseLessonNodeResourceSchema,
  courseLessonSchema,
  courseSchema,
  fileSchema,
  permissionSchema,
  rolePermissionSchema,
  roleSchema,
  userRoleSchema,
  userSchema,
} from '@/db/schema/index.schema';

async function run() {
  console.log('-> 清除数据库中...');
  await db.delete(userSchema);
  await db.delete(userRoleSchema);
  await db.delete(roleSchema);
  await db.delete(rolePermissionSchema);
  await db.delete(permissionSchema);
  await db.delete(courseClassSchema);
  await db.delete(courseClassStudentSchema);
  await db.delete(courseLessonSchema);
  await db.delete(courseSchema);
  await db.delete(courseLessonNodeResourceSchema);
  await db.delete(fileSchema);
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
