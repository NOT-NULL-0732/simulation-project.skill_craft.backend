import { char, integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const permissionSchema = pgTable('permission', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  permission_key: char({ length: 40 }).notNull().unique(),
  name: char({ length: 20 }).notNull().unique(),
  description: varchar({ length: 200 }).notNull(),
});
