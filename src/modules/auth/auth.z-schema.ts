import { string, z } from 'zod';

export const LoginZSchema = z.object({
  email: string().email().max(50),
  password: string().min(8).max(12),
});

export const RegisterZSchema = z.object({
  email: string().email().max(50),
  user_name: string().max(10),
  password: string().min(8).max(12),
});
export const CreateRoleZSchema = z.object({
  name: string().nonempty().min(2).max(20),
  role_key: string().nonempty().min(2).max(40),
  description: string().nullable(),
});
export const CreatePermissionZSchema = z.object({
  name: string().nonempty().min(2).max(20),
  permission_key: string().nonempty().min(2).max(40),
  description: string().nullable(),
});
export const CreateUserRoleZSchema = z.object({
  user_id: z.coerce.number(),
  role_id: z.coerce.number(),
});
export const CreateRolePermissionZSchema = z.object({
  role_id: z.coerce.number(),
  permission_id: z.coerce.number(),
});
