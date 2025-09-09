import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { BusinessExceptionFilter } from '@/common/filter/business-exception.filter';
import { ZodExceptionFilter } from '@/common/filter/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: '*',
    // origin: 'http://127.0.0.1:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app;
  app.useGlobalFilters(new BusinessExceptionFilter());
  app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
