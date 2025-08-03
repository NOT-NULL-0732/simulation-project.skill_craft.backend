import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import {
  createLessonZSchema,
  getLessonListZSchema,
  joinLessonZSchema,
} from '@/modules/lesson/lesson.z-schema';
import { eq } from 'drizzle-orm';
import { lessonClassSchema, lessonSchema } from '@/db/schema/lesson.schema';
import { IAuthenticatedUser } from '@/common/types/express';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import db from '@/db';

@Injectable()
export class LessonService {
  /*
   * 筛选器
   *
   * */

  async getLessonList(
    user: IAuthenticatedUser,
    body: z.infer<typeof getLessonListZSchema>,
  ) {
    if (body.type === 'MY_CREATE_LESSON') {
      return db.query.lessonClassSchema.findMany({
        with: {
          lesson: true,
        },
        where: (lessonClass, { eq, and, exists }) =>
          exists(
            db
              .select()
              .from(lessonSchema)
              .where(
                and(
                  eq(lessonSchema.id, lessonClass.lesson_id),
                  eq(lessonSchema.created_by, user.userId),
                ),
              ),
          ),
      });
    } else if (body.type === 'MY_JOIN_LESSON') {
      return db.query.lessonClassSchema.findMany({
        where: eq(lessonClassSchema.user_id, user.userId),
        with: {
          lesson: true,
        },
      });
    } else {
      return [];
    }
  }

  async createLesson(
    user: IAuthenticatedUser,
    body: z.infer<typeof createLessonZSchema>,
  ) {
    const result = await db
      .insert(lessonSchema)
      .values({
        name: body.lesson_name,
        created_by: user.userId,
      })
      .returning();
    await db.insert(lessonClassSchema).values({
      user_id: user.userId,
      lesson_id: result[0].id,
    });
  }

  async joinLesson(
    user: IAuthenticatedUser,
    body: z.infer<typeof joinLessonZSchema>,
  ) {
    const hasLesson = db.query.lessonClassSchema.findFirst({
      where: eq(lessonClassSchema.lesson_id, body.lesson_id),
    });
    if (!hasLesson)
      throw new BusinessException(ResponseStatusCode.LESSON__LESSON_NOTFOUND);
    const insertResults = await db
      .insert(lessonClassSchema)
      .values({
        user_id: user.userId,
        lesson_id: body.lesson_id,
      })
      .onConflictDoNothing({
        target: [lessonClassSchema.user_id, lessonClassSchema.lesson_id],
      });
    if (insertResults.rowCount === 0)
      throw new BusinessException(
        ResponseStatusCode.LESSON__REPEAT_JOIN_LESSON,
      );
  }
}
