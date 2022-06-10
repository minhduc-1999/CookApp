import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger, LogLevel } from "@nestjs/common";
import {
  NestExpressApplication,
  ExpressAdapter,
} from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "nestjs-config";
import "dotenv/config";
import * as morgan from "morgan";
import * as helmet from "helmet";
import * as cookieParser from "cookie-parser";
import { TransformResponse } from "./interceptors/transform.interceptor";
import { ErrorsInterceptor } from "./interceptors/errors.interceptor";
import { HttpExceptionFilter } from "exception_filter/httpException.filter";
import { join } from "path";

const morganFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

async function bootstrap() {
  const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS)

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: {
        origin: allowedOrigins,
        credentials: true,
      },
    }
  );

  const configService = app.get(ConfigService);

  const APP_HOST = configService.get("app.host");
  const APP_PORT = configService.get("app.port");
  const APP_ENV = configService.get("app.env");

  app.use(morgan(morganFormat));
  app.use(helmet());
  app.use(cookieParser());

  app.setBaseViewsDir(join(__dirname,'views'))
  app.setViewEngine("hbs")

  app.setGlobalPrefix("api", { exclude: ["reset-password"]});

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: APP_ENV === "production",
    })
  );

  app.useGlobalInterceptors(new TransformResponse(), new ErrorsInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * Swagger API
   */
  if (APP_ENV !== "production") {
    const swaggerBuilder = new DocumentBuilder()
      .setTitle("API SPECS TASTIFY 1.0")
      .setDescription("The TASTIFY API description")
      .setVersion("1.0")
      .addBearerAuth();

    if (APP_ENV === "staging")
      swaggerBuilder.addServer(configService.get("app.stagingUrl"));
    else swaggerBuilder.addServer(`http://localhost:${APP_PORT}`);
    const options = swaggerBuilder.build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  // if (APP_ENV === "production") {
  //   Sentry.init({ dsn: configService.get("app.sentryUrl") });
  // }

  const logLevels: LogLevel[] =
    APP_ENV === "production"
      ? ["log", "error", "warn"]
      : ["log", "error", "warn", "debug", "verbose"];
  Logger.overrideLogger(logLevels);
  await app.listen(APP_PORT, APP_HOST);

  Logger.log(`[app] listening on port ${APP_HOST}:${APP_PORT}`, "bootstrap");
}
bootstrap();
