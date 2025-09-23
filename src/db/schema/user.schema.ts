import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userRoleSchema } from '@/db/schema/user-role.schema';
import { uuidV7PrimaryKey } from '@/db/schema/common.schema';

export const userSchema = pgTable('user', {
  id: uuidV7PrimaryKey,
  email: varchar({ length: 50 }).notNull().unique(),
  username: varchar({ length: 50 }).notNull(),
  password: varchar({ length: 200 }).notNull(),
  user_token: varchar({ length: 255 }),
  updated_at: timestamp({ mode: 'string' }).$onUpdateFn(() =>
    new Date().toISOString(),
  ),
  created_at: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const userSchemaRelations = relations(userSchema, ({ many }) => ({
  roles: many(userRoleSchema),
}));
