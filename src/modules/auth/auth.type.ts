import { z } from 'zod';
import {
  CreatePermissionZSchema,
  CreateRolePermissionZSchema,
  CreateRoleZSchema,
  CreateUserRoleZSchema,
  LoginZSchema,
  RegisterZSchema,
} from '@/modules/auth/auth.z-schema';

export interface LoginTokenData {
  userId: string;
  signDate: number; // 签名日期
}

export type TypeAuthController = {
  register: { body: z.infer<typeof RegisterZSchema> };
  login: { body: z.infer<typeof LoginZSchema> };
  userRole: {
    create: {
      body: z.infer<typeof CreateUserRoleZSchema>;
    };
  };
  role: {
    create: {
      body: z.infer<typeof CreateRoleZSchema>;
    };
  };
  rolePermission: {
    create: {
      body: z.infer<typeof CreateRolePermissionZSchema>;
    };
  };
  permission: {
    create: { body: z.infer<typeof CreatePermissionZSchema> };
  };
};

export type TypeAuthService = {
  register: {
    user_name: string;
    password: string;
    email: string;
  };
  login: {
    user_name: string;
    password: string;
    email: string;
  };
};
