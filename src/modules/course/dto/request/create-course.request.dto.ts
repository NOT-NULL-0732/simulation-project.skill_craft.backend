import { z } from 'zod';
import { CommonCourseRequestSchema } from './common-course.request.dto';
import { ZodValidationPipe } from 'nestjs-zod';

export const CreateCourseRequestBodyDtoSchema = z.object({
  files_key: CommonCourseRequestSchema.files_key,
  course_name: CommonCourseRequestSchema.course_name,
});
export const CreateCourseResponseDtoPipe = new ZodValidationPipe(
  CreateCourseRequestBodyDtoSchema,
);
export type CreateCourseRequestBodyDto = z.infer<
  typeof CreateCourseRequestBodyDtoSchema
>;
