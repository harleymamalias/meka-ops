import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // No need for manually wiring logger, interceptors, filters, or request id middleware
  // All are registered globally via AppModule

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MekaOps API')
    .setDescription('Vehicle Service & Maintenance API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  if (process.env.NODE_ENV !== 'prod') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${process.env.API_PREFIX || 'api'}/docs`, app, document);
  }

  await app.listen(process.env.PORT || 4001);
  console.log(`App running on: ${await app.getUrl()}`);
}

void bootstrap();
