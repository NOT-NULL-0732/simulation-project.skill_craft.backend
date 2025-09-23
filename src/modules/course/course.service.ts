import { Injectable } from '@nestjs/common';
import db from '@/db';
import { courseSchema } from '@/db/schema/course.schema';

import { and, eq } from 'drizzle-orm';

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
  async deleteCourse() {
    // implement
  }
  async listCourse() {
    // implement
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
