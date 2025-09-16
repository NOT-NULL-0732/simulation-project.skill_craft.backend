import { Injectable } from '@nestjs/common';
import { TypeServiceCourse } from '@/modules/course/course.type';
import { courseSchema } from '@/db/schema/course.schema';
import db from '@/db';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class CourseService {
  async listCourse(data: TypeServiceCourse['course']['list']) {
    return db
      .select({
        id: courseSchema.id,
        name: courseSchema.name,
        created_by: courseSchema.created_by,
        cover_image: courseSchema.cover_image,
      })
      .from(courseSchema)
      .where(eq(courseSchema.created_by, data.userId));
  }

  async createCourse(data: TypeServiceCourse['course']['create']) {
    const [insertCourseResult] = await db
      .insert(courseSchema)
      .values({
        name: data.name,
        created_by: data.userId,
        cover_image: data.coverImageFileId,
      })
      .returning({
        id: courseSchema.id,
      });
    return insertCourseResult.id;
  }

  async updateCourse(data: TypeServiceCourse['course']['update']) {
    await db
      .update(courseSchema)
      .set({
        name: data.name,
        cover_image: data.coverImage,
      })
      .where(
        and(
          eq(courseSchema.id, data.courseId),
          eq(courseSchema.created_by, data.userId),
        ),
      );
  }

  async deleteCourse(data: TypeServiceCourse['course']['delete']) {
    await db
      .delete(courseSchema)
      .where(
        and(
          eq(courseSchema.id, data.courseId),
          eq(courseSchema.created_by, data.userId),
        ),
      );
  }

  async createLesson(data: TypeServiceCourse['lesson']['create']) {
    //
  }

  async updateLesson(data: TypeServiceCourse['lesson']['update']) {
    //
  }

  async deleteLesson(data: TypeServiceCourse['lesson']['delete']) {
    //
  }

  async createLessonResource(
    data: TypeServiceCourse['lessonResource']['create'],
  ) {
    //
  }

  async updateLessonResource(
    data: TypeServiceCourse['lessonResource']['update'],
  ) {
    //
  }

  async deleteLessonResource(
    data: TypeServiceCourse['lessonResource']['delete'],
  ) {
    //
  }
}
