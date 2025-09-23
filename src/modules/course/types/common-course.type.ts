import { courseSchema } from '@/db/schema/course.schema';

export type ICourseInfo = typeof courseSchema.$inferSelect;
