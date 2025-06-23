import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { Response } from 'express';
import { createResponse, ResponseData } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response: ResponseData) => {
        if (response === undefined)
          response = createResponse(ResponseStatusCode.REQUEST_SUCCESS);
        const httpResponse = context.switchToHttp().getResponse<Response>();
        httpResponse.status(200);
        return response;
      }),
    );
  }
}
