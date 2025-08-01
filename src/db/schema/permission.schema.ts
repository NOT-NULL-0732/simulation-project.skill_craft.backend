import { integer, pgTable, unique, varchar } from 'drizzle-orm/pg-core';

export const permissionSchema = pgTable(
  'permission',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    permission_key: varchar({ length: 40 }).notNull().unique(),
    name: varchar({ length: 20 }).notNull().unique(),
    description: varchar({ length: 200 }),
  },
  (t) => [unique().on(t.name, t.permission_key)],
);
