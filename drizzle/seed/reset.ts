import db from '@/db';
import {
  courseClassSchema,
  courseClassStudentSchema,
  courseLessonResourceSchema,
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
  await db.transaction(async (tx) => {
    await tx.delete(fileSchema);
    await tx.delete(courseLessonResourceSchema);
    await tx.delete(courseLessonSchema);
    await tx.delete(courseClassStudentSchema);
    await tx.delete(courseClassSchema);
    await tx.delete(courseSchema);
    await tx.delete(rolePermissionSchema);
    await tx.delete(userRoleSchema);
    await tx.delete(permissionSchema);
    await tx.delete(roleSchema);
    await tx.delete(userSchema);
  });
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
