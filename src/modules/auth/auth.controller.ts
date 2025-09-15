import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import { LoginZSchema } from '@/modules/auth/auth.z-schema';
import { AuthPermission } from '@/common/decorator/permission.decorator';
import { TypeControllerAuth } from '@/modules/auth/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthPermission('AUTH:USER:LOGIN', false)
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginZSchema))
    body: TypeControllerAuth['login']['body'],
  ) {
    const loginResult = await this.authService.login(body);
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, loginResult);
  }
}
