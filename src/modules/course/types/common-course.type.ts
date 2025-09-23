import { courseSchema } from '@/db/schema/course.schema';
import { IUserInfo } from '@/modules/auth/auth.type';

export type ICourseInfo = typeof courseSchema.$inferSelect;
export type IListCourseInfo = ICourseInfo & {
  created_by_user: IUserInfo;
}
