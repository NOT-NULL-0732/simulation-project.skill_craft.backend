import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthenticatedUser } from '@/common/types/express';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
  (data: keyof IAuthenticatedUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.authenticatedUser;
    return data ? user[data] : user;
  },
);
