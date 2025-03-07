import { NestFactory } from '@nestjs/core';
import { initSwagger } from './api/swagger/init-swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from '@/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  initSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(env.PORT);
}

bootstrap();
