import * as fs from 'fs'
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './modules/shared/errors/infrastructure/filters/domain-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new DomainExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
