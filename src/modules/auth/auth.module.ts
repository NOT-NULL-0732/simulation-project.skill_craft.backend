import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { LoginGuard } from '@/common/guard/login.guard';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, LoginGuard],
  exports: [AuthService, LoginGuard],
})
export class AuthModule {}
