import { char, pgTable, unique } from 'drizzle-orm/pg-core';
import { roleSchema } from '@/db/schema/role.schema';
import { relations } from 'drizzle-orm';
import { userSchema } from '@/db/schema/user.schema';
import { uuidV7PrimaryKey } from '@/db/schema/common.schema';

export const userRoleSchema = pgTable(
  'user-role',
  {
    id: uuidV7PrimaryKey,
    user_id: char({ length: 36 }).references(() => userSchema.id),
    role_id: char({ length: 36 }).references(() => roleSchema.id),
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
