import { z } from 'zod';
import {
  CreateCourseZSchema,
  DeleteCourseZSchema,
  UpdateCourseZSchema,
} from '@/modules/course/course.z-schema';

export type TypeControllerCourse = {
  create: {
    body: z.infer<typeof CreateCourseZSchema.body>;
  };
  update: {
    body: z.infer<typeof UpdateCourseZSchema.body>;
    params: z.infer<typeof UpdateCourseZSchema.params>;
  };
  delete: {
    params: z.infer<typeof DeleteCourseZSchema.params>;
  };
};

export type TypeServiceCourse = {
  create: {
    userId: string;
    fileId: string;
    courseName: string;
  };
  update: {
    courseId: string;
    userId: string;
    fileId?: string;
    courseName?: string;
  };
  delete: {
    courseId: string;
    userId: string;
  };
};
