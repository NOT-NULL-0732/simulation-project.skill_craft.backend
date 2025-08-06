import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '@/common/guard/permission.guard';
import { LoginGuard } from '@/common/guard/login.guard';

export function AuthPermission(
  permissionKey: string,
  needLogin: boolean = true,
) {
  const decorators: (MethodDecorator & ClassDecorator)[] = [];
  if (needLogin) decorators.push(UseGuards(LoginGuard));
  decorators.push(
    SetMetadata('permission_key', permissionKey),
    UseGuards(PermissionGuard),
  );
  decorators.push();
  return applyDecorators(...decorators);
}
