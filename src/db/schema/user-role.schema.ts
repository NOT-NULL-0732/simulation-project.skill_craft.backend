import { integer, pgTable, unique } from 'drizzle-orm/pg-core';
import { roleSchema } from '@/db/schema/role.schema';
import { relations } from 'drizzle-orm';
import { userSchema } from '@/db/schema/user.schema';

export const userRoleSchema = pgTable(
  'userRole',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer(),
    role_id: integer(),
  },
  (t) => [unique().on(t.user_id, t.role_id)],
);
export const userRoleSchemaRelation = relations(userRoleSchema, ({ one }) => ({
  user: one(userSchema, {
    fields: [userRoleSchema.user_id],
    references: [userSchema.id],
  }),
  role: one(roleSchema, {
    fields: [userRoleSchema.role_id],
    references: [roleSchema.id],
  }),
}));
