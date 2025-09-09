import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { z } from 'zod';
import { UploadFileZSchema } from '@/modules/file/file.z-schema';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthPermission } from '@/common/decorator/permission.decorator';
import { AuthUser } from '@/common/decorator/auth-user.decorator';
import { IAuthenticatedUser } from '@/common/types/express';
import { FileService } from '@/modules/file/file.service';
import { Request } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 上传文件
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      storage: memoryStorage(),
    }),
  )
  @AuthPermission('COMMON:FILE:UPLOAD', false)
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(new ZodValidationPipe(UploadFileZSchema))
    body: z.infer<typeof UploadFileZSchema>,
    @AuthUser() user: IAuthenticatedUser | null,
    @Req() req: Request,
  ) {
    if (req.ip === undefined) throw new UnauthorizedException('未知IP请求');
    return this.fileService.uploadFile(body, files, user, req.ip);
  }
}
