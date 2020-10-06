import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DatabaseConfigService } from './config/database/config.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig: DatabaseConfigService = app.get('DatabaseConfigService');

  console.log(appConfig.dbURL);

  const options = new DocumentBuilder()
    .setTitle('Crud example swagger')
    .setDescription('The crud API description')
    .setVersion('1.0')
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'views'));

  await app.listen(3000);
}
bootstrap();
