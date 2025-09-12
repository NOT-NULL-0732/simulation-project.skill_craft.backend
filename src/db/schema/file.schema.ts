import {
  boolean,
  char,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { userSchema } from '@/db/schema/user.schema';
import { relations } from 'drizzle-orm';
import { uuidV7PrimaryKey } from '@/db/schema/common.schema';

export enum FileSchemaWithStatus {
  UNUSE = 0,
  USED = 1,
  DELETED = 2,
}

export const fileSchema = pgTable('upload-file', {
  id: uuidV7PrimaryKey,
  file_name: varchar({ length: 100 }).notNull(), // 文件名
  save_path: varchar({ length: 100 }).notNull(), // 保存路径（因全存在一个文件夹下 可能需要分日期保存）
  file_size: varchar({ length: 50 }).notNull(), // 文件大小
  consumer_service: varchar({ length: 20 }).notNull(), // 消费此文件的服务
  uploaded_by: char({ length: 36 }).references(() => userSchema.id), // 关联用户
  is_delete: boolean().default(false).notNull(), // 文件是否已删除
  status: smallint().notNull(), // 0未使用 1已使用 2已废弃
  created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
  updated_at: timestamp({ mode: 'string' }).$onUpdateFn(() =>
    new Date().toISOString(),
  ),
  deleted_at: timestamp({ mode: 'string' }),
});
export const fileSchemaRelation = relations(fileSchema, ({ one }) => ({
  user: one(userSchema, {
    references: [userSchema.id],
    fields: [fileSchema.uploaded_by],
  }),
}));
