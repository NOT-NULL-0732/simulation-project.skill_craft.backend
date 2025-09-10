import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { FileModule } from './modules/file/file.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [AuthModule, LessonModule, FileModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
