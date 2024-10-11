import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const srv = await NestFactory.create(RootModule);

  const config = new DocumentBuilder()
    .setTitle('Woolf AI Analyzer API')
    .setDescription('API for tech task for Woolf AI')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(srv, config);
  SwaggerModule.setup('api', srv, document);

  await srv.listen(3030);
}
bootstrap();
