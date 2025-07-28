import z from 'zod';

export const getLessonListZSchema = z.object({
  type: z
    .enum(['MY_CREATE_LESSON', 'MY_JOIN_LESSON'])
    .nullable()
    .default('MY_JOIN_LESSON'),
});
export const createLessonZSchema = z.object({
  lesson_name: z.string().min(2).max(20).nonempty(),
});
export const joinLessonZSchema = z.object({
  lesson_id: z.coerce.number(),
});
