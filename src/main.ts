import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { retryAttempts: 1, retryDelay: 3000, port: Number(process.env.MAIL_SERVICE_PORT) },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(Number(process.env.PORT_APP) || 3000);
}
bootstrap();
