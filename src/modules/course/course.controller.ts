import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CourseService } from '@/modules/course/course.service';
import { FileService } from '@/modules/file/file.service';
import { AuthPermission } from '@/common/decorator/permission.decorator';
import { IAuthenticatedUser } from '@/common/types/express';
import { AuthUser } from '@/common/decorator/auth-user.decorator';
import {
  CreateCourseZSchema,
  DeleteCourseZSchema,
  UpdateCourseZSchema,
} from '@/modules/course/course.z-schema';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { TypeControllerCourse } from '@/modules/course/course.type';

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
  @AuthPermission('COURSE:COURSE:CREATE')
  @Post('create-course')
  async createCourse(
    @AuthUser() user: IAuthenticatedUser,
    @Body(new ZodValidationPipe(CreateCourseZSchema.body))
    body: TypeControllerCourse['create']['body'],
    @Req() req: Request,
  ) {
    const files = await this.fileService.getFiles(body.files_key, req.ip);
    const createCourseResult = await this.courseService.createCourse({
      fileId: files[0].id,
      userId: user.userId,
      courseName: body.name,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, {
      courseId: createCourseResult[0].id,
    });
  }

  @AuthPermission('COURSE:COURSE:UPDATE')
  @Patch(':courseId')
  async updateCourse(
    @AuthUser() user: IAuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateCourseZSchema.body))
    body: TypeControllerCourse['update']['body'],
    @Param(new ZodValidationPipe(UpdateCourseZSchema.params))
    params: TypeControllerCourse['update']['params'],
    @Req() req: Request,
  ) {
    let fileId: string | undefined = undefined;
    if (body.files_key) {
      const getFilesResult = await this.fileService.getFiles(
        body.files_key,
        req.ip,
      );
      fileId = getFilesResult[0].id;
    }
    await this.courseService.updateCourse({
      courseId: params.courseId,
      courseName: body.name,
      fileId: fileId,
      userId: user.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:COURSE:DELETE')
  @Delete(':courseId')
  async deleteCourse(
    @AuthUser() user: IAuthenticatedUser,
    @Param(new ZodValidationPipe(DeleteCourseZSchema.params))
    params: TypeControllerCourse['delete']['params'],
  ) {
    await this.courseService.deleteCourse({
      courseId: params.courseId,
      userId: user.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  // async joinCourse() {}
  // async quitCourse() {}
}
