import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import {
  CreatePermissionZSchema,
  CreateRolePermissionZSchema,
  CreateRoleZSchema,
  CreateUserRoleZSchema,
  LoginZSchema,
  RegisterZSchema,
} from '@/modules/auth/auth.z-schema';
import { AuthPermission } from '@/common/decorator/permission.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthPermission('AUTH:USER:REGISTER', false)
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterZSchema))
    body: z.infer<typeof RegisterZSchema>,
  ) {
    await this.authService.register(body);
  }

  @AuthPermission('AUTH:USER:LOGIN', false)
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginZSchema))
    body: z.infer<typeof LoginZSchema>,
  ) {
    const loginResult = await this.authService.login(body);
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, loginResult);
  }

  @AuthPermission('AUTH:ROLE:GET')
  @Get('role')
  async getRoles() {
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      await this.authService.getRoles(),
    );
  }

  @AuthPermission('AUTH:ROLE:ADD')
  @Post('role')
  async createRole(
    @Body(new ZodValidationPipe(CreateRoleZSchema))
    body: z.infer<typeof CreateRoleZSchema>,
  ) {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, {
      role_id: await this.authService.createRole(body),
    });
  }

  @AuthPermission('AUTH:USER_ROLE:ADD')
  @Post('user-role')
  async createUserRole(
    @Body(new ZodValidationPipe(CreateUserRoleZSchema))
    body: z.infer<typeof CreateUserRoleZSchema>,
  ) {
    await this.authService.createUserRole(body);
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('AUTH:PERMISSION:GET')
  @Get('permission')
  async getPermissions() {
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      await this.authService.getPermissions(),
    );
  }

  @AuthPermission('AUTH:PERMISSION:ADD')
  @Post('permission')
  async createPermission(
    @Body(new ZodValidationPipe(CreatePermissionZSchema))
    body: z.infer<typeof CreatePermissionZSchema>,
  ) {
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, {
      permission_id: await this.authService.createPermission(body),
    });
  }

  @AuthPermission('AUTH:ROLE_PERMISSION:ADD')
  @Post('role-permission')
  async createRolePermission(
    @Body(new ZodValidationPipe(CreateRolePermissionZSchema))
    body: z.infer<typeof CreateRolePermissionZSchema>,
  ) {
    await this.authService.createRolePermission(body);
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }
}
