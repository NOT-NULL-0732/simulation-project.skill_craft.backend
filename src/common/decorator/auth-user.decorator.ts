import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthenticatedUser } from '@/common/types/express';
import { Request } from 'express';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';

export const AuthUser = createParamDecorator(
  (data: keyof IAuthenticatedUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.authenticatedUser)
      throw new BusinessException(
        ResponseStatusCode.AUTH__USER_NOT_LOGIN_ERROR,
      );
    return data ? request.authenticatedUser[data] : request.authenticatedUser;
  },
);
