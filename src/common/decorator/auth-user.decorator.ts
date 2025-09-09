import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthenticatedUser } from '@/common/types/express';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
  (data: keyof IAuthenticatedUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.authenticatedUser) return null;
    return data ? request.authenticatedUser[data] : request.authenticatedUser;
  },
);
