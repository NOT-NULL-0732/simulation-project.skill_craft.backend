import {
  IListCourseInfo,
} from '@/modules/course/types/common-course.type';

export function listCourseResponseDto(
  courses: {
    course_id: string;
    course_name: string;
    course_created_by: string;
    course_cover_image: string;
    user_id: string;
    user_username: string;
    user_email: string;
    user_created_at: string;
  }[],
): IListCourseInfo[] {
  return courses.map((item) => {
    return {
      id: item.course_id,
      name: item.course_name,
      cover_image: item.course_cover_image,
      created_by: item.course_created_by,
      created_by_user: {
        id: item.user_id,
        email: item.user_email,
        created_at: item.user_created_at,
        username: item.user_username,
      },
    };
  });
}
