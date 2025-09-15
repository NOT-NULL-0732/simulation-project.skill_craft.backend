import { z } from 'zod';
import { LoginZSchema } from '@/modules/auth/auth.z-schema';

export interface LoginTokenData {
  userId: string;
  signDate: number; // 签名日期
}

export type TypeControllerAuth = {
  login: { body: z.infer<typeof LoginZSchema> };
};

export type TypeServiceAuth = {
  login: {
    password: string;
    email: string;
  };
};
