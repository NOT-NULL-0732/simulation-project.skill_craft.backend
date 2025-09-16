import { Injectable } from '@nestjs/common';
import { TypeServiceCourse } from '@/modules/course/course.type';
import { courseLessonSchema, courseSchema } from '@/db/schema/course.schema';
import db from '@/db';
import { and, eq } from 'drizzle-orm';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';

@Injectable()
export class CourseService {
  private async _canAccessCourse(data: {
    courseId: string;
    userId: string;
  }): Promise<boolean> {
    const queryCourseResult = await db.query.courseSchema
      .findFirst({
        where: and(
          eq(courseSchema.id, data.courseId),
          eq(courseSchema.created_by, data.userId),
        ),
      })
      .execute();
    if (!queryCourseResult)
      throw new BusinessException(ResponseStatusCode.COURSE__NOT_PERMISSION);
    return true;
  }

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
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
    await db
      .update(courseSchema)
      .set({
        name: data.name,
        cover_image: data.coverImage,
      })
      .where(eq(courseSchema.id, data.courseId));
  }

  async deleteCourse(data: TypeServiceCourse['course']['delete']) {
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
    await db.delete(courseSchema).where(eq(courseSchema.id, data.courseId));
  }

  async listLesson(data: TypeServiceCourse['lesson']['list']) {
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
    return await db
      .select({
        id: courseLessonSchema.id,
        name: courseLessonSchema.name,
        order: courseLessonSchema.order,
        parent_id: courseLessonSchema.parent_id,
        course_id: courseLessonSchema.course_id,
      })
      .from(courseLessonSchema)
      .execute();
  }

  async createLesson(data: TypeServiceCourse['lesson']['create']) {
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
    await db
      .insert(courseLessonSchema)
      .values({
        name: data.lessonName,
        course_id: data.courseId,
        order: data.order, // TODO 排序平衡 排序相同检查
        parent_id: data.parentLessonId,
      })
      .execute();
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

  async listLessonResource(data: TypeServiceCourse['lessonResource']['list']) {
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
