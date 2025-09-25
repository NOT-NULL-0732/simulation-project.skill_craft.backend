import { Injectable } from '@nestjs/common';
import db from '@/db';
import { courseSchema } from '@/db/schema/course.schema';
import { and, eq } from 'drizzle-orm';
import { userSchema } from '@/db/schema/user.schema';

@Injectable()
export class CourseService {
  async createCourse(data: {
    userId: string;
    courseName: string;
    coverImageFileId: string;
  }) {
    const [insertCourseResult] = await db
      .insert(courseSchema)
      .values({
        name: data.courseName,
        created_by: data.userId,
        cover_image: data.coverImageFileId,
      })
      .returning();
    return insertCourseResult;
  }

  async updateCourse(data: {
    courseId: string;
    userId: string;
    courseName?: string;
    coverImageFileId?: string;
  }): Promise<void> {
    await db
      .update(courseSchema)
      .set({
        name: data.courseName,
        cover_image: data.coverImageFileId,
      })
      .where(
        and(
          eq(courseSchema.id, data.courseId),
          eq(courseSchema.created_by, data.userId),
        ),
      );
  }

  async deleteCourse(data: { courseId: string; userId: string }) {
    await db
      .delete(courseSchema)
      .where(
        and(
          eq(courseSchema.id, data.courseId),
          eq(courseSchema.created_by, data.userId),
        ),
      );
  }

  async listCourse(data: { userId: string }) {
    return await db
      .select({
        course_id: courseSchema.id,
        course_name: courseSchema.name,
        course_created_by: courseSchema.created_by,
        course_cover_image: courseSchema.cover_image,
        user_id: userSchema.id,
        user_username: userSchema.username,
        user_email: userSchema.email,
        user_created_at: userSchema.created_at,
      })
      .from(courseSchema)
      .where(eq(courseSchema.created_by, data.userId))
      .innerJoin(userSchema, eq(userSchema.id, data.userId));
  }
  async listLesson() {
    // implement
  }
  async createLesson() {
    // implement
  }
  async deleteLesson() {
    // implement
  }
  async updateLesson() {
    // implement
  }
  async listLessonResource() {
    // implement
  }
  async createLessonResource() {
    // implement
  }
  async deleteLessonResource() {
    // implement
  }
  async updateLessonResource() {
    // implement
  }
}
