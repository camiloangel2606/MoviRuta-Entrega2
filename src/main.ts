import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // limpia campos no definidos
      forbidNonWhitelisted: true, // error si mandan basura
      transform: true,            // transforma types de DTOs
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();