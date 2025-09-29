import { ILIstLessonResponse } from '@/modules/course/types/common-lesson.type';

export function listCourseResponseDto(data: {
  course_id: string;
  id: string;
  name: string;
  order: number;
  parent_id: string | null;
}): ILIstLessonResponse {
  return {
    course_id: data.course_id,
    id: data.id,
    name: data.name,
    order: data.order,
    parent_id: data.parent_id,
  };
}
