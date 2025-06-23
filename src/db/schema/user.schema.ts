import { char, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const userSchema = pgTable('user', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: char({ length: 50 }).notNull().unique(),
  user_name: timestamp(),
  password: char({ length: 200 }).notNull(),
  user_token: char({ length: 255 }),
  updated_at: timestamp({ mode: 'string' }).$onUpdateFn(() =>
    new Date().toString(),
  ),
  created_at: timestamp({ mode: 'string' }).defaultNow(),
});
