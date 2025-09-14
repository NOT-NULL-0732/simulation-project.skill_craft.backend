import { z } from 'zod';

const CourseIdParamZSchema = z.string();
export const CreateCourseZSchema = {
  body: z.object({
    files_key: z.string(),
    name: z.string(),
  }),
};

export const UpdateCourseZSchema = {
  body: z.object({
    files_key: z.string().optional(),
    name: z.string().optional(),
  }),
  params: z.object({
    courseId: CourseIdParamZSchema,
  }),
};

export const DeleteCourseZSchema = {
  params: z.object({
    courseId: CourseIdParamZSchema,
  }),
};
