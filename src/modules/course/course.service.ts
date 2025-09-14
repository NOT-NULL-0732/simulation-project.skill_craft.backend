import { Injectable } from '@nestjs/common';
import db from '@/db';
import { courseSchema } from '@/db/schema/course.schema';
import { TypeServiceCourse } from '@/modules/course/course.type';
import { and, eq } from 'drizzle-orm';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';

@Injectable()
export class CourseService {
  async createCourse(data: TypeServiceCourse['create']) {
    return db
      .insert(courseSchema)
      .values({
        name: data.courseName,
        cover_image: data.fileId,
        created_by: data.userId,
      })
      .returning({
        id: courseSchema.id,
        name: courseSchema.name,
        cover_image: courseSchema.cover_image,
        created_by: courseSchema.created_by,
      })
      .execute();
  }

  async updateCourse(data: TypeServiceCourse['update']) {
    await db
      .update(courseSchema)
      .set({
        name: data.courseName,
        cover_image: data.fileId,
      })
      .where(
        and(
          eq(courseSchema.id, data.courseId),
          eq(courseSchema.created_by, data.userId),
        ),
      );
  }

  async deleteCourse(data: TypeServiceCourse['delete']) {
    const deleteCourseResult = await db
      .delete(courseSchema)
      .where(
        and(
          eq(courseSchema.id, data.courseId),
          eq(courseSchema.created_by, data.userId),
        ),
      );
    if (deleteCourseResult.rows.length === 0)
      throw new BusinessException(
        ResponseStatusCode.COURSE__DELETE_COURSE_NOT_FOUND,
      );
  }

  // async joinCourse() {}
  // async quitCourse() {}
}
