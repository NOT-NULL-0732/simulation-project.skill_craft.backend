import { ICreateLessonResponse } from '@/modules/course/types/common-lesson.type';

export function createLessonResponseDto(data: {
  lesson_id: string;
}): ICreateLessonResponse {
  return {
    lesson_id: data.lesson_id,
  };
}
