import { z } from 'zod';
import {
  CourseLessonZSchema,
  CourseZSchema,
} from '@/modules/course/course.z-schema';

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
  courseLesson: {
    list: {
      params: z.infer<typeof CourseLessonZSchema.list.params>;
    };
    create: {
      body: z.infer<typeof CourseLessonZSchema.create.body>;
      params: z.infer<typeof CourseLessonZSchema.create.params>;
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
    list: {
      userId: string;
      courseId: string;
    };
    create: {
      userId: string;
      lessonName: string;
      courseId: string;
      parentLessonId: string | undefined;
      order: number;
    };
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
