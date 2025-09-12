import { Controller } from '@nestjs/common';
import { CourseService } from '@/modules/course/course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly lessonService: CourseService) {}

  /*
    现在已有对象：
      课程
        课程节点
          课程节点资源
        课程班级
          课程班级学生
    * */
}
