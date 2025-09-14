import { char, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { uuidV7PrimaryKey } from '@/db/schema/common.schema';
import { userSchema } from '@/db/schema/user.schema';
import { fileSchema } from '@/db/schema/file.schema';

// 课程
export const courseSchema = pgTable('course', {
  id: uuidV7PrimaryKey,
  name: varchar({ length: 30 }).notNull(),
  created_by: char({ length: 36 })
    .references(() => userSchema.id)
    .notNull(),
  cover_image: char({ length: 36 }).references(() => fileSchema.id),
});

export const courseSchemaRelations = relations(courseSchema, ({ many }) => ({
  class_list: many(courseClassSchema),
}));

// 课程节点
export const courseLessonSchema = pgTable('course-lesson', {
  id: uuidV7PrimaryKey,
  name: varchar({ length: 20 }).notNull(), // 课程节点名
  course_id: char({ length: 36 })
    .references(() => courseSchema.id)
    .notNull(),
  parent_id: char({ length: 36 }).references(() => courseLessonSchema.id),
  order: integer().notNull(), // 课程同一父亲节点下的节点排序
});

export const courseLessonSchemaRelations = relations(
  courseLessonSchema,
  ({ one }) => ({
    course: one(courseSchema, {
      fields: [courseLessonSchema.course_id],
      references: [courseSchema.id],
    }),
    course_lesson: one(courseLessonSchema, {
      fields: [courseLessonSchema.parent_id],
      references: [courseLessonSchema.id],
    }),
  }),
);

// 课程节点资源
export const courseLessonNodeResourceSchema = pgTable(
  'course-lesson-node-resource',
  {
    id: uuidV7PrimaryKey,
    course_lesson_id: char({ length: 36 })
      .references(() => courseLessonSchema.id)
      .notNull(),
    resource: varchar({ length: 200 }).notNull(), // 资源文件路径
    order: integer().notNull(),
  },
);

export const courseLessonNodeResourceSchemaRelations = relations(
  courseLessonNodeResourceSchema,
  ({ one }) => ({
    course_lesson: one(courseLessonSchema, {
      fields: [courseLessonNodeResourceSchema.course_lesson_id],
      references: [courseLessonSchema.id],
    }),
  }),
);

// 班级
export const courseClassSchema = pgTable('course-class', {
  id: uuidV7PrimaryKey,
  course_id: char({ length: 36 }).references(() => courseSchema.id),
  name: varchar({ length: 30 }).notNull(), // 班级名称
});

export const courseClassRelation = relations(
  courseClassSchema,
  ({ one, many }) => ({
    course: one(courseSchema, {
      fields: [courseClassSchema.course_id],
      references: [courseSchema.id],
    }),
    students: many(courseClassStudentSchema),
  }),
);

// 班级学生
export const courseClassStudentSchema = pgTable('course-class-student', {
  id: uuidV7PrimaryKey,
  user_id: char({ length: 36 }).references(() => userSchema.id),
  course_class_id: char({ length: 36 }).references(() => courseClassSchema.id),
});
