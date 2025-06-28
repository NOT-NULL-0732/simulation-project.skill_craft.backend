import {
  char,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userSchema = pgTable('user', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: char({ length: 50 }).notNull().unique(),
  user_name: varchar({ length: 50 }).notNull(),
  password: varchar({ length: 200 }).notNull(),
  user_token: varchar({ length: 255 }),
  updated_at: timestamp({ mode: 'string' }).$onUpdateFn(() =>
    new Date().toISOString(),
  ),
  created_at: timestamp({ mode: 'string' }).defaultNow(),
});
