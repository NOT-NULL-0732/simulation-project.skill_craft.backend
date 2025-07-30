import { char, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { permissionSchema } from '@/db/schema/permission.schema';

export const roleSchema = pgTable('role', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  role_key: char({ length: 40 }).notNull().unique(),
  name: char({ length: 20 }).notNull().unique(),
  description: varchar({ length: 200 }),
});

export const roleSchemaRelation = relations(roleSchema, ({ many }) => ({
  permissions: many(permissionSchema),
}));
