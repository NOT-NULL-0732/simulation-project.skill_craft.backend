import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BusinessExceptionFilter } from '@/common/filter/business-exception.filter';
import { ZodExceptionFilter } from '@/common/filter/zod-exception.filter';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { AppModule } from '@/app.module';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new BusinessExceptionFilter());
  app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.init();
  return app;
}
