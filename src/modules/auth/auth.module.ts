import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { DrizzleModule } from '@/modules/drizzle/drizzle.module';
import { LoginGuard } from '@/common/guard/login.guard';

@Module({
  imports: [DrizzleModule],
  controllers: [AuthController],
  providers: [AuthService, LoginGuard],
  exports: [AuthService, LoginGuard],
})
export class AuthModule {}
