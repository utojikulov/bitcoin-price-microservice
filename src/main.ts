import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)

    const port = configService.get<number>('app.port', 3000)

    const config = new DocumentBuilder()
    .setTitle('Crypto Price API')
    .setDescription('Crypto Price Microservice API description.')
    .setVersion('1.0')
    .addTag('Crypto')
    .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(port)
    console.log(`Application is runnning on: ${await app.getUrl()}`)
    console.log(`API description is runnning on: ${await app.getUrl()}/api`)
}

bootstrap();
