import { pgTable, unique, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { rolePermissionSchema } from '@/db/schema/role-permission.schema';
import { uuidV7PrimaryKey } from '@/db/schema/common.schema';

export const roleSchema = pgTable(
  'role',
  {
    id: uuidV7PrimaryKey,
    role_key: varchar({ length: 40 }).notNull().unique(),
    name: varchar({ length: 20 }).notNull().unique(),
    description: varchar({ length: 200 }),
  },
  (t) => [unique().on(t.name, t.role_key)],
);

export const roleSchemaRelation = relations(roleSchema, ({ many }) => ({
  permissions: many(rolePermissionSchema),
}));
