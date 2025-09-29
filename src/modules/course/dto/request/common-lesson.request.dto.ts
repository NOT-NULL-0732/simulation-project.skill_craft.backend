import { z } from 'zod';

export const CommonLessonRequestDtoSchema = {
  lesson_id: z.string().uuid(),
  lesson_name: z.string().min(0).max(20).nonempty(),
  lesson_order: z.number().positive().min(0).max(10000000),
};
