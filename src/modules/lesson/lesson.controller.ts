import { Controller } from '@nestjs/common';
import { LessonService } from '@/modules/lesson/lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}
}
