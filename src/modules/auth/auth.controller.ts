import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { createResponse } from '@/common/utils/create-response';
import { ResponseStatusCode } from '@/common/types/response-status.enum';
import {
  LoginZSchema,
  UserRoleZSchema,
  UserZSchema,
} from '@/modules/auth/auth.z-schema';
import { AuthPermission } from '@/common/decorator/permission.decorator';
import { TypeControllerAuth } from '@/modules/auth/auth.type';
import { dbResultByGroup } from '@/common/utils/db-result-by-group';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthPermission('AUTH:USER:LOGIN', false)
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginZSchema))
    body: TypeControllerAuth['login']['body'],
  ) {
    const loginResult = await this.authService.login({
      email: body.email,
      password: body.password,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, {
      userId: loginResult.id,
      username: loginResult.username,
      user_token: loginResult.user_token,
    });
  }

  @AuthPermission('AUTH:USER:CREATE')
  @Post('user')
  async createUser(
    @Body(new ZodValidationPipe(UserZSchema.create.body))
    body: TypeControllerAuth['user']['create']['body'],
  ) {
    const createUserResult = await this.authService.createUser({
      email: body.email,
      username: body.username,
      password: body.password,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS, {
      userId: createUserResult.userId,
    });
  }

  @AuthPermission('AUTH:USER:DELETE')
  @Delete('user/:userId')
  async deleteUser(
    @Param(new ZodValidationPipe(UserZSchema['delete']['params']))
    params: TypeControllerAuth['user']['delete']['params'],
  ) {
    await this.authService.deleteUser({
      userId: params.userId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('AUTH:USER:UPDATE')
  @Patch('user/:userId')
  async updateUser(
    @Param(new ZodValidationPipe(UserZSchema['update']['params']))
    params: TypeControllerAuth['user']['update']['params'],
    @Body(new ZodValidationPipe(UserZSchema['update']['body']))
    body: TypeControllerAuth['user']['update']['body'],
  ) {
    await this.authService.updateUser({
      userId: params.userId,
      username: body.username,
      email: body.email,
      password: body.password,
    });
    createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('AUTH:USER:LIST')
  @Get('user')
  async listUser() {
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      dbResultByGroup(await this.authService.listUser(), 'userId', 'role'),
    );
  }

  @AuthPermission('AUTH:ROLE:LIST')
  @Get('role')
  async listRole() {
    return createResponse(
      ResponseStatusCode.REQUEST_SUCCESS,
      await this.authService.listRole(),
    );
  }

  @AuthPermission('AUTH:USER_ROLE:CREATE')
  @Post('user-role')
  async createUserRole(
    @Body(new ZodValidationPipe(UserRoleZSchema['create']['body']))
    body: TypeControllerAuth['userRole']['create']['body'],
  ) {
    await this.authService.createUserRole({
      userId: body.user_id,
      roleId: body.role_id,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }

  @AuthPermission('AUTH:USER_ROLE:DELETE')
  @Delete('user-role/:userRoleId')
  async deleteUserRole(
    @Param(new ZodValidationPipe(UserRoleZSchema['delete']['params']))
    params: TypeControllerAuth['userRole']['delete']['params'],
  ) {
    await this.authService.deleteUserRole({
      userRoleId: params.userRoleId,
    });
    return createResponse(ResponseStatusCode.REQUEST_SUCCESS);
  }
}
