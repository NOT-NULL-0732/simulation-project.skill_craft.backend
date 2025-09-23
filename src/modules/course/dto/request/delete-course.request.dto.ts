import { z } from 'zod';
import { CommonCourseRequestSchema } from '@/modules/course/dto/request/common-course.request.dto';
import { ZodValidationPipe } from 'nestjs-zod';
// DTO Schemas
export const DeleteCourseRequestParams = CommonCourseRequestSchema.course_id;
// DTO Pipes
export const DeleteCourseResponseParamsDtoPipe = new ZodValidationPipe(
  DeleteCourseRequestParams,
);
// DTO
export type DeleteCourseRequestParamsDto = z.infer<
  typeof DeleteCourseRequestParams
>;
