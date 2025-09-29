import { ForbiddenException, Injectable } from '@nestjs/common';
import db from '@/db';
import { courseLessonSchema, courseSchema } from '@/db/schema/course.schema';
import { and, eq, isNull } from 'drizzle-orm';
import { userSchema } from '@/db/schema/user.schema';

@Injectable()
export class CourseService {
  async _canAccessCourseLesson(data: { userId: string; lessonId?: string }) {
    if (!data.lessonId) return;
    const [selectCourseLessonAndCourseResult] = await db
      .select({
        course_created_by: courseSchema.created_by,
      })
      .from(courseLessonSchema)
      .where(eq(courseLessonSchema.id, data.lessonId))
      .innerJoin(
        courseSchema,
        eq(courseSchema.id, courseLessonSchema.course_id),
      );
    if (
      !selectCourseLessonAndCourseResult ||
      selectCourseLessonAndCourseResult.course_created_by !== data.userId
    )
      // TODO 错误类型待完善
      throw new ForbiddenException();
  }

  // 访问课程验证
  async _canAccessCourse(data: { courseId: string; userId: string }) {
    const isOwner = Boolean(
      await db
        .select()
        .from(courseSchema)
        .where(
          and(
            eq(courseSchema.id, data.courseId),
            eq(courseSchema.created_by, data.userId),
          ),
        ),
    );
    // TODO 错误类型待完善
    if (!isOwner) throw new ForbiddenException();
  }

  // order平衡机制 当前后项目相差小于100则重新调整为间隔10000 (0 <= order <= 10000000)
  async _lessonBalance(data: { courseId: string; parent_id?: string }) {
    const peerLessonNode = await db
      .select({
        lesson_id: courseLessonSchema.id,
      })
      .from(courseLessonSchema)
      .where(
        and(
          eq(courseLessonSchema.course_id, data.courseId),
          data.parent_id
            ? eq(courseLessonSchema.parent_id, data.parent_id)
            : isNull(courseLessonSchema.parent_id),
        ),
      );
    await db.transaction(async (tx) => {
      peerLessonNode.map(async (item, index) => {
        await tx
          .update(courseLessonSchema)
          .set({
            order: index * 10000,
          })
          .where(eq(courseLessonSchema.id, item.lesson_id))
          .execute();
      });
    });
  }
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
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
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
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
    await db.delete(courseSchema).where(eq(courseSchema.id, data.courseId));
  }

  async listCourse(data: { userId: string }) {
    return db
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

  async listLesson(data: { courseId: string; userId: string }) {
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
    return db
      .select({
        id: courseLessonSchema.id,
        name: courseLessonSchema.name,
        course_id: courseLessonSchema.course_id,
        parent_id: courseLessonSchema.parent_id,
        order: courseLessonSchema.order,
      })
      .from(courseSchema)
      .innerJoin(
        courseLessonSchema,
        eq(courseLessonSchema.course_id, data.courseId),
      );
  }

  async createLesson(data: {
    name: string;
    course_id: string;
    parent_id?: string;
    order: number;
    user_id: string;
  }) {
    await this._canAccessCourse({
      courseId: data.course_id,
      userId: data.user_id,
    });
    // TODO 节点嵌套层数检查
    const [queryRepeatLessonOrder] = await db
      .select({
        lesson_id: courseLessonSchema.id,
      })
      .from(courseLessonSchema)
      .where(
        and(
          eq(courseLessonSchema.course_id, data.course_id),
          eq(courseLessonSchema.order, data.order),
          data.parent_id
            ? eq(courseLessonSchema.parent_id, data.parent_id)
            : isNull(courseLessonSchema.parent_id),
        ),
      )
      .execute();
    if (queryRepeatLessonOrder) throw new Error('重复的order');
    const [createCourseLessonResult] = await db
      .insert(courseLessonSchema)
      .values({
        name: data.name,
        course_id: data.course_id,
        parent_id: data.parent_id,
        order: data.order,
      })
      .returning({
        lesson_id: courseLessonSchema.id,
      });
    if (data.order < 100)
      await this._lessonBalance({
        courseId: data.course_id,
        parent_id: data.parent_id,
      });
    return createCourseLessonResult;
  }

  async deleteLesson(data: {
    courseId: string;
    userId: string;
    lessonId: string;
  }) {
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
    await db
      .delete(courseLessonSchema)
      .where(
        and(
          eq(courseLessonSchema.id, data.lessonId),
          eq(courseLessonSchema.course_id, data.courseId),
        ),
      );
  }

  async updateLesson(data: {
    courseId: string;
    userId: string;
    lessonId: string;
    updateData: Partial<{
      parentId: string;
      order: number;
      name: string;
    }>;
  }) {
    await this._canAccessCourse({
      courseId: data.courseId,
      userId: data.userId,
    });
    await this._canAccessCourseLesson({
      lessonId: data.updateData.parentId,
      userId: data.userId,
    });
    await db
      .update(courseLessonSchema)
      .set({
        name: data.updateData.name,
        parent_id: data.updateData.parentId,
        order: data.updateData.order,
      })
      .where(
        and(
          eq(courseLessonSchema.id, data.lessonId),
          eq(courseLessonSchema.course_id, data.courseId),
        ),
      );
    if (data.updateData.order)
      if (data.updateData.order < 100)
        await this._lessonBalance({
          courseId: data.courseId,
          parent_id: data.updateData.parentId,
        });
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
