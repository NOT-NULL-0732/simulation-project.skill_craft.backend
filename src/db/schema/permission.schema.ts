import { pgTable, unique, varchar } from 'drizzle-orm/pg-core';
import { uuidV7PrimaryKey } from '@/db/schema/common.schema';

export const permissionSchema = pgTable(
  'permission',
  {
    id: uuidV7PrimaryKey,
    permission_key: varchar({ length: 40 }).notNull().unique(),
    name: varchar({ length: 20 }).notNull().unique(),
    description: varchar({ length: 200 }),
  },
  (t) => [unique().on(t.name, t.permission_key)],
);
