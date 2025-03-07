import { NestFactory } from '@nestjs/core';
import { initSwagger } from './api/swagger/init-swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
