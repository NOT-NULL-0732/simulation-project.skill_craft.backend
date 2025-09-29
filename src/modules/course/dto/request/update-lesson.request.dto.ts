import { z } from 'zod';
import { CommonLessonRequestDtoSchema } from '@/modules/course/dto/request/common-lesson.request.dto';
import { CommonCourseRequestSchema } from '@/modules/course/dto/request/common-course.request.dto';
import { ZodValidationPipe } from 'nestjs-zod';
// DTO Schemas
export const UpdateLessonRequestBodySchema = z
  .object({
    lesson_name: CommonLessonRequestDtoSchema.lesson_name.optional(),
    parent_lesson_id: CommonLessonRequestDtoSchema.lesson_id.optional(),
    lesson_order: CommonLessonRequestDtoSchema.lesson_order.optional(),
  })
  .refine((data) => {
    for (let i = 0; i < Object.keys(data).length; i++) {
      if (Object.keys(data)[i]) return true;
    }
    return false;
  }, '必须更新一个参数');
export const UpdateLessonRequestParamsSchema = z.object({
  courseId: CommonCourseRequestSchema.course_id,
  lessonId: CommonCourseRequestSchema.course_lesson_id,
});
// DTO Pipes
export const UpdateLessonRequestBodyDtoPipe = new ZodValidationPipe(
  UpdateLessonRequestBodySchema,
);
export const UpdateLessonRequestParamsDtoPipe = new ZodValidationPipe(
  UpdateLessonRequestParamsSchema,
);
// DTO
export type UpdateLessonRequestBodyDto = z.infer<
  typeof UpdateLessonRequestBodySchema
>;
export type UpdateLessonRequestParamsDto = z.infer<
  typeof UpdateLessonRequestParamsSchema
>;
