import { integer, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userSchema } from '@/db/schema/user.schema';

export const lessonSchema = pgTable('lesson', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 30 }).notNull(), // 课程名
  created_by: integer()
    .references(() => userSchema.id)
    .notNull(),
});

export const lessonSchemaRelations = relations(lessonSchema, ({ one }) => ({
  created_by_user: one(userSchema, {
    fields: [lessonSchema.created_by],
    references: [userSchema.id],
  }),
}));

export const lessonClassSchema = pgTable(
  'lesson-class',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer(),
    lesson_id: integer(),
  },
  (t) => [uniqueIndex().on(t.lesson_id, t.user_id)],
);

export const lessonClassSchemaRelation = relations(
  lessonClassSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [lessonClassSchema.user_id],
      references: [userSchema.id],
    }),
    lesson: one(lessonSchema, {
      fields: [lessonClassSchema.lesson_id],
      references: [lessonSchema.id],
    }),
  }),
);

export const lessonNodeSchema = pgTable('lesson-node', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  lesson_id: integer(),
  name: varchar({ length: 30 }).notNull(),
  video_url: varchar({ length: 50 }).notNull(),
  order: integer().notNull(),
});
