import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const document = new DocumentBuilder()
    .setTitle('Api Swagger')
    .setDescription('The project-floorPlans API description')
    .setVersion('1.0')
    .build();

  const writerDescriptorDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api/swagger', app, writerDescriptorDocument);
  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Application is listening on port: ${port}`)
}
bootstrap();
