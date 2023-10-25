import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT);
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  console.log(`📚 Api Doc http://localhost:${process.env.PORT}/api/docs`);
}
bootstrap();
