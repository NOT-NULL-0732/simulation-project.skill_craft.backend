import { string, z } from 'zod';

export const AuthCommonZSchema = {
  email: string().email().max(50),
  password: string().min(8).max(12),
  username: string().max(50),
};

export const LoginZSchema = z.object({
  email: AuthCommonZSchema.email,
  password: AuthCommonZSchema.password,
});

export const UserZSchema = {
  create: {
    body: z.object({
      username: AuthCommonZSchema.username,
      email: AuthCommonZSchema.email,
      password: AuthCommonZSchema.password,
    }),
  },
  delete: {
    params: z.object({
      userId: z.string().uuid(),
    }),
  },
  update: {
    params: z.object({
      userId: z.string().uuid(),
    }),
    body: z.object({
      username: AuthCommonZSchema.username.optional(),
      email: AuthCommonZSchema.email.optional(),
      password: AuthCommonZSchema.password.optional(),
    }),
  },
};

export const UserRoleZSchema = {
  create: {
    body: z.object({
      user_id: z.string().uuid(),
      role_id: z.string().uuid(),
    }),
  },
  delete: {
    params: z.object({
      userRoleId: z.string().uuid(),
    }),
  },
};
