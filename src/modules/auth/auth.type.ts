import { z } from 'zod';
import { LoginZSchema, UserZSchema } from '@/modules/auth/auth.z-schema';

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
  };
};
