import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { BusinessException } from '@/common/exception/business.exception';
import { ResponseStatusCode } from '@/common/types/response-status.enum';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    Logger.verbose('触发了验证');
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const authorization = request.headers['authorization'];
    if (!authorization)
      throw new BusinessException(
        ResponseStatusCode.AUTH__TOKEN_VALIDATOR_ERROR,
      );
    const [_, token] = authorization.split('Bearer ');
    const userId = await this.authService.validateUserToken(token);
    request.authenticatedUser = { userId };
    return true;
  }
}
