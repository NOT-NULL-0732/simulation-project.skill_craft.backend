import { z } from 'zod';

export const CourseCommonZSchema = {
  course_id: z.string().uuid(),
  course_name: z.string().max(30),
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
  create: {},
  delete: {},
};
export const CourseLessonResourceZSchema = {
  create: {},
  delete: {},
};
