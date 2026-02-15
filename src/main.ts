import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.enableCors();

  app.setGlobalPrefix('api');

  const swaggerConfig = configService.get('swagger');
  const documentBuilder = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup(swaggerConfig.path, app, document);

  const port = configService.get('port');
  await app.listen(port);
  console.log(`app running on http://localhost:${port}`);
  console.log(`swagger docs at http://localhost:${port}/${swaggerConfig.path}`);
}
bootstrap();
