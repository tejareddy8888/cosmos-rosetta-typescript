import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Cosmos_Rosetta_API')
    .setDescription('Typescript based cosmos rosetta')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/docs', app, swaggerDocument);
  await app.listen(3000);
}
bootstrap();
