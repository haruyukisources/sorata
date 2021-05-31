import { NestFactory } from '@nestjs/core';
import { main } from 'src';
import { AppModule } from './app.module';

async function bootstrap() {
  await main().catch(console.error);
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // need change to development or production.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(3001);
}
bootstrap();
