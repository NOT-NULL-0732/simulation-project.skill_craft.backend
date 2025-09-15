import { Controller } from '@nestjs/common';
import { CourseService } from '@/modules/course/course.service';
import { FileService } from '@/modules/file/file.service';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly fileService: FileService,
  ) {}

  /*
    现在已有对象：
      课程
        课程节点
          课程节点资源
        课程班级
          课程班级学生
    * */
}
