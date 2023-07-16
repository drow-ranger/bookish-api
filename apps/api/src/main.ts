import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Bookish-API')
    .setDescription(
      'Bookish-API is a comprehensive and versatile application programming interface (API) designed specifically for book-related data. It provides developers with seamless access to a vast collection of information on books, including details about authors, genres, publication dates, summaries, and much more.',
    )
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
