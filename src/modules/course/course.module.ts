import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '@/modules/file/file.module';

@Module({
  imports: [AuthModule, FileModule],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
