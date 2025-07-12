import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { DrizzleModule } from '@/modules/drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, DrizzleModule],
  providers: [LessonService],
  controllers: [LessonController],
})
export class LessonModule {}
