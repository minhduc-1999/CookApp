import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, LogLevel } from '@nestjs/common';
import {
  NestExpressApplication,
  ExpressAdapter,
} from '@nestjs/platform-express';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import * as Sentry from '@sentry/node';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from 'nestjs-config';
import 'dotenv/config';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { TransformResponse } from './interceptors/transform.interceptor';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

const morganFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: {
        origin: [
          'http://localhost:8000'
        ],
        credentials: true
      }
    }
  );
  const configService = app.get(ConfigService);

  app.use(morgan(morganFormat));
  app.use(helmet());
  app.use(cookieParser());


  app.setGlobalPrefix('api')

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: configService.get('app.env') === 'production',
  }));

  app.useGlobalInterceptors(new ErrorsInterceptor(), new TransformResponse())

  /**
   * Swagger API
   */
  const options = new DocumentBuilder()
    .setTitle("API SPECS COOKAPP 1.0")
    .setDescription("The COOKAPP API description")
    .setVersion("1.0")
    .addTag("message-queue")
    .addBearerAuth()
    .addServer("http://localhost:3000")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  if (configService.get('app.env') === 'production') {
    Sentry.init({ dsn: configService.get('app.sentryUrl') });
  }

  const APP_HOST = configService.get('app.host');
  const APP_PORT = configService.get('app.port');
  const logLevels: LogLevel[] =
    configService.get('app.env') === 'production'
      ? ['log', 'error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'];
  Logger.overrideLogger(logLevels);
  await app.listen(APP_PORT, APP_HOST);

  Logger.log(`[app] listening on port ${APP_HOST}:${APP_PORT}`, 'bootstrap');
}
bootstrap();
