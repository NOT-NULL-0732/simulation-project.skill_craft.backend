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
    const userId = await this.authService.validateUserToken(authorization);
    Logger.verbose('触发了验证');
    request.authenticatedUser = { userId };
    return true;
  }
}
