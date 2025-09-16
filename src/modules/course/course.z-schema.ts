import { z } from 'zod';

export const CourseCommonZSchema = {
  course_id: z.string().uuid(),
  course_name: z.string().max(30),
  course_lesson_id: z.string().uuid(),
  course_lesson_name: z.string().max(20),
  course_lesson_order: z.number().min(100).max(10000),
  course_class_id: z.string().uuid(),
  files_key: z.string(),
};

export const CourseZSchema = {
  create: {
    body: z.object({
      name: CourseCommonZSchema.course_name,
      files_key: CourseCommonZSchema.files_key,
    }),
  },
  update: {
    body: z
      .object({
        name: CourseCommonZSchema.course_name.optional(),
        files_key: CourseCommonZSchema.files_key.optional(),
      })
      .refine(
        (data) => !(data.name === undefined && data.files_key === undefined),
        {
          message: '必须有一个更改的参数',
          params: ['name', 'files_key'],
        },
      ),
    params: z.object({
      courseId: CourseCommonZSchema.course_id,
    }),
  },
  delete: {
    params: z.object({
      courseId: CourseCommonZSchema.course_id,
    }),
  },
};
export const CourseLessonZSchema = {
  list: {
    params: z.object({
      courseId: CourseCommonZSchema.course_id,
    }),
  },
  create: {
    body: z.object({
      name: CourseCommonZSchema.course_lesson_name,
      order: CourseCommonZSchema.course_lesson_order,
      parent_lesson_id: CourseCommonZSchema.course_lesson_id.optional(),
    }),
    params: z.object({
      courseId: CourseCommonZSchema.course_id,
    }),
  },
  delete: {},
};
export const CourseLessonResourceZSchema = {
  create: {},
  delete: {},
};
