// 自定义业务异常
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { BusinessException } from '@/common/exception/business.exception';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    console.log(exception);
    throw new BusinessException(ResponseStatusCode.COMMON__VALIDATE_ERROR);
  }
}
