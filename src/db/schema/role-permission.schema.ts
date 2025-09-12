import { char, pgTable, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { permissionSchema } from '@/db/schema/permission.schema';
import { roleSchema } from '@/db/schema/role.schema';
import { uuidV7PrimaryKey } from '@/db/schema/common.schema';

export const rolePermissionSchema = pgTable(
  'role-permission',
  {
    id: uuidV7PrimaryKey,
    permission_id: char({ length: 36 }).references(() => permissionSchema.id),
    role_id: char({ length: 36 }).references(() => roleSchema.id),
  },
  (t) => [unique().on(t.role_id, t.permission_id)],
);
export const rolePermissionSchemaRelation = relations(
  rolePermissionSchema,
  ({ one }) => ({
    permission: one(permissionSchema, {
      fields: [rolePermissionSchema.permission_id],
      references: [permissionSchema.id],
    }),
    role: one(roleSchema, {
      fields: [rolePermissionSchema.role_id],
      references: [roleSchema.id],
    }),
  }),
);
