import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const authorization = request.headers['authorization'];
    if (!authorization) return false;
    const [_, token] = authorization.split('Bearer ');
    const userId = await this.authService.validateUserToken(token);
    Logger.verbose('触发了验证');
    request.authenticatedUser = { userId };
    return true;
  }
}
