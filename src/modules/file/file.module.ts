import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
