import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { RedisModule } from '@/modules/redis/redis.module';

@Module({
  imports: [AuthModule, RedisModule],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
// export class FileModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LimitMiddleware).forRoutes(FileController);
//   }
// }
