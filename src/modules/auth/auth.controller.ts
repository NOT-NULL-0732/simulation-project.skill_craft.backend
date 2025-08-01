import { Body, Controller, Get, Logger, Post, Request } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import {
  CreatePermissionZSchema,
  CreateRoleZSchema,
  LoginZSchema,
  RegisterZSchema,
} from '@/modules/auth/auth.z-schema';
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

  @Get('role')
  async getRoles() {
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      await this.authService.getRoles(),
    );
  }

  @Post('role')
  async createRole(
    @Body(new ZodValidationPipe(CreateRoleZSchema))
    body: z.infer<typeof CreateRoleZSchema>,
  ) {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, {
      role_id: await this.authService.createRole(body),
    });
  }

  @Post('user-role')
  async createUserRole() {}

  @Get('permission')
  async getPermissions() {
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      await this.authService.getPermissions(),
    );
  }

  @Post('permission')
  async createPermission(
    @Body(new ZodValidationPipe(CreatePermissionZSchema))
    body: z.infer<typeof CreatePermissionZSchema>,
  ) {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, {
      permission_id: await this.authService.createPermission(body),
    });
  }

  @Post('role-permission')
  async createRolePermission() {}
}
