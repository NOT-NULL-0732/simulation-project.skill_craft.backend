import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoginGuard } from '@/common/guard/login.guard';
import { AuthUser } from '@/common/decorator/auth-user.decorator';
import { IAuthenticatedUser } from '@/common/types/express';
import { DrizzleService } from '@/modules/drizzle/drizzle.service';
import { lessonClassSchema, lessonSchema } from '@/db/schema/lesson.schema';
import { z } from 'zod';
import {
  CreateLessonZSchema,
  JoinLessonZSchema,
  LessonIdParam,
} from '@/modules/lesson/lesson.z-schema';
import { ZodValidationPipe } from 'nestjs-zod';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { eq } from 'drizzle-orm';
import { userSchema } from '@/db/schema/user.schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BusinessException } from '@/common/exception/business.exception';

@Controller('lesson')
export class LessonController {
  db: NodePgDatabase<typeof import('../../db/schema/index.schema')>;

  constructor(private readonly drizzleService: DrizzleService) {
    const { db } = this.drizzleService;
    this.db = db;
  }

  @UseGuards(LoginGuard)
  @Get('lesson-list')
  async getUserLessons(@AuthUser() user: IAuthenticatedUser) {
    const result = await this.db.query.userSchema.findFirst({
      with: {
        created_lessons: true,
      },
      where: eq(userSchema.id, user.userId),
    });
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      result?.created_lessons ?? [],
    );
  }

  @UseGuards(LoginGuard)
  @Post('lesson-create')
  async createLesson(
    @AuthUser() user: IAuthenticatedUser,
    @Body(new ZodValidationPipe(CreateLessonZSchema))
    body: z.infer<typeof CreateLessonZSchema>,
  ) {
    const insertResults = await this.db
      .insert(lessonSchema)
      .values({
        name: body.name,
        created_by: user.userId,
      })
      .returning({
        lessons_id: lessonSchema.id,
      });
    const insertResult = insertResults[0];
    await this.db.insert(lessonClassSchema).values({
      lesson_id: insertResult.lessons_id,
      user_id: user.userId,
    });

    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, insertResult);
  }

  @UseGuards(LoginGuard)
  @Get('my-lesson-json')
  async myJoinLesson(@AuthUser() user: IAuthenticatedUser) {
    const result = await this.db.query.lessonClassSchema.findMany({
      where: eq(lessonClassSchema.user_id, user.userId),
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, result);
  }

  @UseGuards(LoginGuard)
  @Post('lesson-join')
  async joinLesson(
    @AuthUser() user: IAuthenticatedUser,
    @Body(new ZodValidationPipe(JoinLessonZSchema))
    body: z.infer<typeof JoinLessonZSchema>,
  ) {
    const hasLesson = await this.db.query.lessonSchema.findFirst({
      where: eq(lessonSchema.id, body.lesson_id),
    });
    if (!hasLesson)
      throw new BusinessException(
        ResponseStatusCode.REQUEST_SUCCESS,
        '课程不存在',
      );
    const insertResult = await this.db
      .insert(lessonClassSchema)
      .values({
        lesson_id: body.lesson_id,
        user_id: user.userId,
      })
      .onConflictDoNothing({
        target: [lessonClassSchema.user_id, lessonClassSchema.lesson_id],
      });

    if (insertResult.rowCount === 0)
      throw new BusinessException(
        ResponseStatusCode.REQUEST_SUCCESS,
        '重复加入课程',
      );
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @UseGuards(LoginGuard)
  @Get(':id/user')
  async lessonUserList(
    @Param(new ZodValidationPipe(LessonIdParam))
    lessonParam: z.infer<typeof LessonIdParam>,
  ) {
    const result = await this.db.query.lessonClassSchema.findMany({
      where: eq(lessonClassSchema.lesson_id, lessonParam.id),
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, result);
  }
}
