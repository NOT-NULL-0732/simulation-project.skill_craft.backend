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
import { CourseService } from '@/modules/course/course.service';
import { FileService } from '@/modules/file/file.service';
import { AuthPermission } from '@/common/decorator/permission.decorator';
import {
  CreateCourseRequestBodyDto,
  CreateCourseResponseDtoPipe,
} from '@/modules/course/dto/request/create-course.request.dto';
import { AuthUser } from '@/common/decorator/auth-user.decorator';
import { IAuthenticatedUser } from '@/common/types/express';
import type { Request } from 'express';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { createCourseResponseDto } from '@/modules/course/dto/response/create-course.response.dto';
import {
  UpdateCourseRequestParamsDto,
  UpdateCourseResponseBodyDto,
  UpdateCourseResponseDtoPipe,
  UpdateCourseResponseParamsDtoPipe,
} from '@/modules/course/dto/request/update-course.request.dto';
import {
  DeleteCourseRequestParamsDto,
  DeleteCourseResponseParamsDtoPipe,
} from '@/modules/course/dto/request/delete-course.request.dto';
import { listCourseResponseDto } from './dto/response/list-course.response.dto';
import {
  ListLessonResponseParamsDto,
  ListLessonResponseParamsPipe,
} from '@/modules/course/dto/request/list-lesson.request.dto';
import {
  UpdateLessonRequestBodyDto,
  UpdateLessonRequestBodyDtoPipe,
  UpdateLessonRequestParamsDto,
  UpdateLessonRequestParamsDtoPipe,
} from '@/modules/course/dto/request/update-lesson.request.dto';
import {
  CreateLessonRequestBodyDto,
  CreateLessonRequestBodyDtoPipe,
  CreateLessonRequestParamsDto,
  CreateLessonRequestParamsDtoPipe,
} from './dto/request/create-lesson.request.dto';
import {
  DeleteLessonResponseParamsDto,
  DeleteLessonResponseParamsPipe,
} from '@/modules/course/dto/request/delete-lesson.request.dto';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly fileService: FileService,
  ) {}

  @AuthPermission('COURSE:COURSE:CREATE')
  @Post('course')
  async createCourse(
    @Body(CreateCourseResponseDtoPipe)
    body: CreateCourseRequestBodyDto,
    @AuthUser() user: IAuthenticatedUser,
    @Req() req: Request,
  ) {
    const [getFilesResult] = await this.fileService.getFiles(
      body.files_key,
      'course__course_cover_image',
      req.ip,
    );

    const createCourseResult = await this.courseService.createCourse({
      courseName: body.course_name,
      userId: user.userId,
      coverImageFileId: getFilesResult.id,
    });

    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      createCourseResponseDto(createCourseResult),
    );
  }

  @AuthPermission('COURSE:COURSE:UPDATE')
  @Patch('course/:courseId')
  async updateCourse(
    @Param(UpdateCourseResponseParamsDtoPipe)
    params: UpdateCourseRequestParamsDto,
    @Body(UpdateCourseResponseDtoPipe) body: UpdateCourseResponseBodyDto,
    @AuthUser() user: IAuthenticatedUser,
    @Req() req: Request,
  ) {
    let cover_image_file_id: undefined | string;
    if (body.files_key) {
      const [getFilesResult] = await this.fileService.getFiles(
        body.files_key,
        'course__course_cover_image',
        req.ip,
      );
      cover_image_file_id = getFilesResult.id;
    }
    await this.courseService.updateCourse({
      courseId: params.courseId,
      courseName: body.course_name,
      coverImageFileId: cover_image_file_id,
      userId: user.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:COURSE:DELETE')
  @Delete('course/:courseId')
  async deleteCourse(
    @Param(DeleteCourseResponseParamsDtoPipe)
    params: DeleteCourseRequestParamsDto,
    @AuthUser() user: IAuthenticatedUser,
  ) {
    await this.courseService.deleteCourse({
      courseId: params.courseId,
      userId: user.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:COURSE:LIST')
  @Get('course')
  async listCourse(@AuthUser() user: IAuthenticatedUser) {
    const listCourseResults = await this.courseService.listCourse({
      userId: user.userId,
    });
    // TODO 转换逻辑待梳理
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      listCourseResponseDto(listCourseResults),
    );
  }

  @AuthPermission('COURSE:LESSON:LIST')
  @Get(':courseId/lessons')
  async listLesson(
    @Param(ListLessonResponseParamsPipe) params: ListLessonResponseParamsDto,
    @AuthUser() user: IAuthenticatedUser,
  ) {
    const listLessonResult = await this.courseService.listLesson({
      courseId: params.courseId,
      userId: user.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, listLessonResult);
  }

  @AuthPermission('COURSE:LESSON:CREATE')
  @Post(':courseId/lessons')
  async createLesson(
    @Param(CreateLessonRequestParamsDtoPipe)
    params: CreateLessonRequestParamsDto,
    @AuthUser() user: IAuthenticatedUser,
    @Body(CreateLessonRequestBodyDtoPipe) body: CreateLessonRequestBodyDto,
  ) {
    const createLessonResult = await this.courseService.createLesson({
      course_id: params.courseId,
      name: body.lesson_name,
      order: body.lesson_order,
      parent_id: body.parent_lesson_id,
      user_id: user.userId,
    });
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      createLessonResult,
    );
  }

  @AuthPermission('COURSE:LESSON:DELETE')
  @Delete(':courseId/lessons/:lessonId')
  async deleteLesson(
    @Param(DeleteLessonResponseParamsPipe)
    params: DeleteLessonResponseParamsDto,
    @AuthUser() user: IAuthenticatedUser,
  ) {
    await this.courseService.deleteLesson({
      courseId: params.courseId,
      lessonId: params.lessonId,
      userId: user.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:LESSON:UPDATE')
  @Patch(':courseId/lessons/:lessonId')
  async updateLesson(
    @Param(UpdateLessonRequestParamsDtoPipe)
    params: UpdateLessonRequestParamsDto,
    @Body(UpdateLessonRequestBodyDtoPipe) body: UpdateLessonRequestBodyDto,
    @AuthUser() user: IAuthenticatedUser,
  ) {
    await this.courseService.updateLesson({
      courseId: params.courseId,
      lessonId: params.lessonId,
      userId: user.userId,
      updateData: {
        name: body.lesson_name,
        order: body.lesson_order,
        parentId: body.parent_lesson_id,
      },
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('COURSE:LESSON_RESOURCE:LIST')
  async listLessonResource() {
    // implement
  }

  @AuthPermission('COURSE:LESSON_RESOURCE:CREATE')
  async createLessonResource() {
    // implement
  }

  @AuthPermission('COURSE:LESSON_RESOURCE:DELETE')
  async deleteLessonResource() {
    // implement
  }

  @AuthPermission('COURSE:LESSON_RESOURCE:UPDATE')
  async updateLessonResource() {
    // implement
  }
}
