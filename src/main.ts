import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { BusinessExceptionFilter } from '@/common/filter/business-exception.filter';
import { ZodExceptionFilter } from '@/common/filter/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new BusinessExceptionFilter());
  app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
