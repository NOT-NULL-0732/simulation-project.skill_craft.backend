import { Controller } from '@nestjs/common';
import { CourseService } from '@/modules/course/course.service';
import { FileService } from '@/modules/file/file.service';
import { AuthPermission } from '@/common/decorator/permission.decorator';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly fileService: FileService,
  ) {}

  @AuthPermission('COURSE:COURSE:CREATE')
  async createCourse() {
    // implement
  }
  @AuthPermission('COURSE:COURSE:UPDATE')
  async updateCourse() {
    // implement
  }
  @AuthPermission('COURSE:COURSE:DELETE')
  async deleteCourse() {
    // implement
  }
  @AuthPermission('COURSE:COURSE:LIST')
  async listCourse() {
    // implement
  }
  @AuthPermission('COURSE:LESSON:LIST')
  async listLesson() {
    // implement
  }
  @AuthPermission('COURSE:LESSON:CREATE')
  async createLesson() {
    // implement
  }
  @AuthPermission('COURSE:LESSON:DELETE')
  async deleteLesson() {
    // implement
  }
  @AuthPermission('COURSE:LESSON:UPDATE')
  async updateLesson() {
    // implement
  }
  @AuthPermission('COURSE:LESSON_RESOURCE:LIST')
  async listLessonResource() {
    // implement
  }
  @AuthPermission('COURSE:LESSON_RESOURCE:CREATE')
  async createLessonResource() {
    // implement
  }
  @AuthPermission('COURSE:LESSON_RESOURCE:DELETE')
  async deleteLessonResource() {
    // implement
  }
  @AuthPermission('COURSE:LESSON_RESOURCE:UPDATE')
  async updateLessonResource() {
    // implement
  }
}
