import { z } from 'zod';
import { CommonCourseRequestSchema } from '@/modules/course/dto/request/common-course.request.dto';
import { ZodValidationPipe } from 'nestjs-zod';
// DTO Schemas
export const UpdateCourseRequestBodyDtoSchema = z
  .object({
    files_key: CommonCourseRequestSchema.files_key.optional(),
    course_name: CommonCourseRequestSchema.course_name.optional(),
  })
  .refine((data) => Boolean(data.course_name || data.files_key), {
    message: '必须有一个更改的参数',
    params: ['name', 'files_key'],
  });
export const UpdateCourseRequestParams = z.object({
  courseId: CommonCourseRequestSchema.course_id,
});
// DTO Pipes
export const UpdateCourseResponseDtoPipe = new ZodValidationPipe(
  UpdateCourseRequestBodyDtoSchema,
);
export const UpdateCourseResponseParamsDtoPipe = new ZodValidationPipe(
  UpdateCourseRequestParams,
);
// DTO
export type UpdateCourseResponseBodyDto = z.infer<
  typeof UpdateCourseRequestBodyDtoSchema
>;
export type UpdateCourseRequestParamsDto = z.infer<
  typeof UpdateCourseRequestParams
>;
