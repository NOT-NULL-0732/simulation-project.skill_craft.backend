import { Module } from '@nestjs/common';
import { DrizzleService } from '@/modules/drizzle/drizzle.service';

@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {

}
