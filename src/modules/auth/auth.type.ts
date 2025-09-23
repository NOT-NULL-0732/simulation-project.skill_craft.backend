import { z } from 'zod';
import {
  LoginZSchema,
  UserRoleZSchema,
  UserZSchema,
} from '@/modules/auth/auth.z-schema';

export interface IUserInfo {
  id: string,
  email: string,
  username: string,
  created_at: string,
}

export interface LoginTokenData {
  userId: string;
  signDate: number; // 签名日期
}

export type TypeControllerAuth = {
  login: { body: z.infer<typeof LoginZSchema> };
  user: {
    create: {
      body: z.infer<(typeof UserZSchema)['create']['body']>;
    };
    delete: {
      params: z.infer<(typeof UserZSchema)['delete']['params']>;
    };
    update: {
      params: z.infer<(typeof UserZSchema)['update']['params']>;
      body: z.infer<(typeof UserZSchema)['update']['body']>;
    };
  };
  userRole: {
    create: {
      body: z.infer<(typeof UserRoleZSchema)['create']['body']>;
    };
    delete: {
      params: z.infer<(typeof UserRoleZSchema)['delete']['params']>;
    };
  };
};

export type TypeServiceAuth = {
  login: {
    password: string;
    email: string;
  };
  user: {
    create: {
      username: string;
      password: string;
      email: string;
    };
    delete: {
      userId: string;
    };
    update: {
      userId: string;
      username: string | undefined;
      email: string | undefined;
      password: string | undefined;
    };
  };
  userRole: {
    create: {
      userId: string;
      roleId: string;
    };
    delete: {
      userRoleId: string;
    };
  };
};
