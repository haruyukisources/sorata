import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as shell from 'shelljs';

/*
 * check dependencies
 * needs:
 * - git
 */

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

async function bootstrap() {
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
