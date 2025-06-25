// 自定义业务异常
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { createResponse } from '@/common/utils/create-response';
import { BusinessException } from '@/common/exception/business.exception';
import type { Response } from 'express';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    // 将业务异常转换为标准响应格式
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response
      .status(200)
      .json(createResponse(exception.code, undefined, exception.message));
  }
}
