import { z } from 'zod';
import { CourseZSchema } from '@/modules/course/course.z-schema';

export type TypeControllerCourse = {
  course: {
    create: {
      body: z.infer<typeof CourseZSchema.create.body>;
    };
    update: {
      body: z.infer<typeof CourseZSchema.update.body>;
      params: z.infer<typeof CourseZSchema.update.params>;
    };
    delete: {
      params: z.infer<typeof CourseZSchema.delete.params>;
    };
  };
};
export type TypeServiceCourse = {
  course: {
    create: {
      coverImageFileId: string; // 文件id
      name: string;
      userId: string;
    };
    update: {
      coverImage: string | undefined;
      name: string | undefined;
      userId: string;
      courseId: string;
    };
    delete: {
      userId: string;
      courseId: string;
    };
    list: {
      userId: string;
    };
  };
  lesson: {
    list: {};
    create: {};
    update: {};
    delete: {};
  };
  lessonResource: {
    list: {};
    create: {};
    update: {};
    delete: {};
  };
};
