import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LessonService } from '@/modules/lesson/lesson.service';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { LoginGuard } from '@/common/guard/login.guard';
import { AuthUser } from '@/common/decorator/auth-user.decorator';
import { IAuthenticatedUser } from '@/common/types/express';
import {
  createLessonZSchema,
  getLessonListZSchema,
  joinLessonZSchema,
} from '@/modules/lesson/lesson.z-schema';
import z from 'zod';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(LoginGuard)
  @Get()
  async getLessonList(
    @AuthUser() user: IAuthenticatedUser,
    @Query(new ZodValidationPipe(getLessonListZSchema))
    body: z.infer<typeof getLessonListZSchema>,
  ) {
    const result = await this.lessonService.getLessonList(user, body);
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, result);
  }

  @UseGuards(LoginGuard)
  @Post()
  async createLesson(
    @AuthUser() user: IAuthenticatedUser,
    @Body(new ZodValidationPipe(createLessonZSchema))
    body: z.infer<typeof createLessonZSchema>,
  ) {
    await this.lessonService.createLesson(user, body);
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @UseGuards(LoginGuard)
  @Post('join')
  async joinLesson(
    @AuthUser() user: IAuthenticatedUser,
    @Body(new ZodValidationPipe(joinLessonZSchema))
    body: z.infer<typeof joinLessonZSchema>,
  ) {
    await this.lessonService.joinLesson(user, body);
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }
}
