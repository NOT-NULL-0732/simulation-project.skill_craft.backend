import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { FileModule } from './modules/file/file.module';
import { RedisModule } from './modules/redis/redis.module';
import { RequestTestMiddleware } from '@/common/middleware/request-test.middleware';

@Module({
  imports: [AuthModule, LessonModule, FileModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestTestMiddleware).forRoutes('*');
  }
}
