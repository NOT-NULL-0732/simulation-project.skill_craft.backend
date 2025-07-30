import { integer, pgTable, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { permissionSchema } from '@/db/schema/permission.schema';
import { roleSchema } from '@/db/schema/role.schema';

export const rolePermissionSchema = pgTable(
  'rolePermission',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    permission_id: integer(),
    role_id: integer(),
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
