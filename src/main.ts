import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pipes } from '@commons/utils/pipes';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.use(helmet());

  app.setGlobalPrefix('api');
  app.useGlobalPipes(Pipes.validationPipe());

  await app.listen(port).then(() => {
    logger.log(`Listen on ${port} -> http://localhost:${port}`);
  });
}

bootstrap();
