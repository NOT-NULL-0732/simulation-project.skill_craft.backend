import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from '@/modules/course/course.module';
import { FileModule } from './modules/file/file.module';
import { RedisModule } from './modules/redis/redis.module';
import { CryptoModule } from './modules/crypto/crypto.module';

@Module({
  imports: [AuthModule, CourseModule, FileModule, RedisModule, CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
