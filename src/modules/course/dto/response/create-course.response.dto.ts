import { ICourseInfo } from '@/modules/course/types/common-course.type';

export function createCourseResponseDto(course: ICourseInfo) {
  return {
    course_id: course.id,
  };
}
