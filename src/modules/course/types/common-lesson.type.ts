export type ICreateLessonResponse = {
  lesson_id: string;
};
export type ILIstLessonResponse = {
  id: string;
  name: string;
  course_id: string;
  parent_id: string | null;
  order: number;
};
