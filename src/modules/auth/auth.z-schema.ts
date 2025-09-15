import { string, z } from 'zod';

export const LoginZSchema = z.object({
  email: string().email().max(50),
  password: string().min(8).max(12),
});
