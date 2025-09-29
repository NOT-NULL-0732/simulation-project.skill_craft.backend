import { z } from 'zod';
import { CommonLessonRequestDtoSchema } from '@/modules/course/dto/request/common-lesson.request.dto';
import { CommonCourseRequestSchema } from '@/modules/course/dto/request/common-course.request.dto';
import { ZodValidationPipe } from 'nestjs-zod';
// DTO Schemas
export const CreateLessonRequestBodySchema = z.object({
  lesson_name: CommonLessonRequestDtoSchema.lesson_name,
  parent_lesson_id: CommonLessonRequestDtoSchema.lesson_id.optional(),
  lesson_order: CommonLessonRequestDtoSchema.lesson_order,
});
export const CreateLessonRequestParamsSchema = z.object({
  courseId: CommonCourseRequestSchema.course_id,
});
// DTO Pipes
export const CreateLessonRequestBodyDtoPipe = new ZodValidationPipe(
  CreateLessonRequestBodySchema,
);
export const CreateLessonRequestParamsDtoPipe = new ZodValidationPipe(
  CreateLessonRequestParamsSchema,
);
// DTO
export type CreateLessonRequestBodyDto = z.infer<
  typeof CreateLessonRequestBodySchema
>;
export type CreateLessonRequestParamsDto = z.infer<
  typeof CreateLessonRequestParamsSchema
>;
