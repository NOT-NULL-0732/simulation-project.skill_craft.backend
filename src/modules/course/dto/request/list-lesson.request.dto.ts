import { z } from 'zod';
import { CommonCourseRequestSchema } from '@/modules/course/dto/request/common-course.request.dto';
import { ZodValidationPipe } from 'nestjs-zod';

export const ListLessonRequestParamsSchema = z.object({
  courseId: CommonCourseRequestSchema.course_id,
});
// DTO Pipes
export const ListLessonResponseParamsPipe = new ZodValidationPipe(
  ListLessonRequestParamsSchema,
);
// DTO
export type ListLessonResponseParamsDto = z.infer<
  typeof ListLessonRequestParamsSchema
>;
