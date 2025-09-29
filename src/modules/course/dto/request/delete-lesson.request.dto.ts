// DTO Schemas
import { z } from 'zod';
import { CommonLessonRequestDtoSchema } from '@/modules/course/dto/request/common-lesson.request.dto';
import { CommonCourseRequestSchema } from '@/modules/course/dto/request/common-course.request.dto';
import { ZodValidationPipe } from 'nestjs-zod';

export const DeleteLessonRequestParamsSchema = z.object({
  courseId: CommonCourseRequestSchema.course_id,
  lessonId: CommonLessonRequestDtoSchema.lesson_id,
});
// DTO Pipes
export const DeleteLessonResponseParamsPipe = new ZodValidationPipe(
  DeleteLessonRequestParamsSchema,
);
// DTO
export type DeleteLessonResponseParamsDto = z.infer<
  typeof DeleteLessonRequestParamsSchema
>;
