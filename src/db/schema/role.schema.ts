import { integer, pgTable, unique, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { permissionSchema } from '@/db/schema/permission.schema';

export const roleSchema = pgTable(
  'role',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    role_key: varchar({ length: 40 }).notNull().unique(),
    name: varchar({ length: 20 }).notNull().unique(),
    description: varchar({ length: 200 }),
  },
  (t) => [unique().on(t.name, t.role_key)],
);

export const roleSchemaRelation = relations(roleSchema, ({ many }) => ({
  permissions: many(permissionSchema),
}));
