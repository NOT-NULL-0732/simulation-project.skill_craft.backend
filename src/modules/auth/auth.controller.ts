import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { LoginZSchema, RegisterZSchema } from '@/modules/auth/auth.z-schema';
import { AuthUser } from '@/common/decorator/auth-user.decorator';
import { IAuthenticatedUser } from '@/common/types/express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterZSchema))
    body: z.infer<typeof RegisterZSchema>,
  ) {
    await this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginZSchema))
    body: z.infer<typeof LoginZSchema>,
  ) {
    const loginResult = await this.authService.login(body);
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, loginResult);
  }

  @Post('test-login')
  async testLogin(
    @AuthUser() user: IAuthenticatedUser,
    @Request() req: Request,
  ) {
    Logger.verbose('验证成功');
    console.log(user);
  }
}
