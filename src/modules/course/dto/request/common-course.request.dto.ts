import z from 'zod';

export const CommonCourseRequestSchema = {
  course_id: z.string().uuid(),
  course_name: z.string().max(30),
  course_lesson_id: z.string().uuid(),
  course_lesson_name: z.string().max(20),
  course_lesson_order: z.number().min(100).max(10000),
  course_class_id: z.string().uuid(),
  files_key: z.string(),
};