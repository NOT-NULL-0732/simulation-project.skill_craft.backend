import { string, z } from 'zod';

export const CreateLessonZSchema = z.object({
  name: string().min(2),
});

export const JoinLessonZSchema = z.object({
  lesson_id: z.coerce.number(),
});

export const LessonIdParam = z.object({
  id: z.coerce.number(),
});
