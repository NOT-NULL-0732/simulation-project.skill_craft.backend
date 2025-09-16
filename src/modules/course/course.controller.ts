import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CourseService } from '@/modules/course/course.service';
import { FileService } from '@/modules/file/file.service';
import { AuthPermission } from '@/common/decorator/permission.decorator';
import { ZodValidationPipe } from 'nestjs-zod';
import { CourseZSchema } from '@/modules/course/course.z-schema';
import { TypeControllerCourse } from '@/modules/course/course.type';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { AuthUser } from '@/common/decorator/auth-user.decorator';
import { IAuthenticatedUser } from '@/common/types/express';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly fileService: FileService,
  ) {}

  /*
    现在已有对象：
      课程
        课程节点
          课程节点资源
        课程班级
          课程班级学生
    * */

  @AuthPermission('COURSE:COURSE:LIST')
  @Get('course')
  async listCourse(@AuthUser() user: IAuthenticatedUser) {
    const listCourseResult = await this.courseService.listCourse({
      userId: user.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, listCourseResult);
  }

  @AuthPermission('COURSE:COURSE:CREATE')
  @Post('course')
  async createCourse(
    @AuthUser() user: IAuthenticatedUser,
    @Body(new ZodValidationPipe(CourseZSchema.create.body))
    body: TypeControllerCourse['course']['create']['body'],
    @Req() req: Request,
  ) {
    const [getFilesResult] = await this.fileService.getFiles(
      body.files_key,
      'course__course_cover_image',
      req.ip,
    );
    const createCourseResult = await this.courseService.createCourse({
      name: body.name,
      coverImageFileId: getFilesResult.id,
      userId: user.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, {
      courseId: createCourseResult,
    });
  }

  @AuthPermission('COURSE:COURSE:UPDATE')
  @Patch('course/:courseId')
  async updateCourse(
    @Body(new ZodValidationPipe(CourseZSchema.update.body))
    body: TypeControllerCourse['course']['update']['body'],
    @Param(new ZodValidationPipe(CourseZSchema.update.params))
    params: TypeControllerCourse['course']['update']['params'],
    @AuthUser() user: IAuthenticatedUser,
    @Req() req: Request,
  ) {
    let getFilesResult:
      | Awaited<ReturnType<typeof this.fileService.getFiles>>[number]
      | undefined;
    if (body.files_key) {
      getFilesResult = (
        await this.fileService.getFiles(
          body.files_key,
          'course__course_cover_image',
          req.ip,
        )
      )[0];
    }
    await this.courseService.updateCourse({
      userId: user.userId,
      name: body.name,
      coverImage: getFilesResult ? getFilesResult.id : undefined,
      courseId: params.courseId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:COURSE:DELETE')
  @Delete('course')
  async deleteCourse(
    @AuthUser() user: IAuthenticatedUser,
    @Param(new ZodValidationPipe(CourseZSchema.delete.params))
    params: TypeControllerCourse['course']['delete']['params'],
  ) {
    await this.courseService.deleteCourse({
      userId: user.userId,
      courseId: params.courseId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:LESSON:CREATE')
  async createLesson() {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:LESSON:UPDATE')
  async updateLesson() {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:LESSON:DELETE')
  async deleteLesson() {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:LESSON_RESOURCE:CREATE')
  async createLessonResource() {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:LESSON_RESOURCE:UPDATE')
  async updateLessonResource() {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:LESSON_RESOURCE:DELETE')
  async deleteLessonResource() {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }
}
