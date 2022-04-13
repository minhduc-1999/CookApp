import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { AuthModule } from "modules/auth/auth.module";
import { CommunicationModule } from "modules/communication/communication.module";
import { ConfigurationModule } from "modules/configuration/configuration.module";
import { CoreModule } from "modules/core/core.module";
import { NotificationModule } from "modules/notification/notification.module";
import { UserModule } from "modules/user/user.module";
import { RavenModule } from "nest-raven";
import { ConfigModule, ConfigService } from "nestjs-config";
import * as path from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import "./boilerplate.polyfill";
import { TraceIdInterceptor } from "./interceptors/traceId.interceptor";
import { contextMiddleware } from "./middleware/context.middleware";

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, "config", "**/!(*.d).{ts,js}")),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    RavenModule,
    AuthModule,
    UserModule,
    CoreModule,
    NotificationModule,
    ConfigurationModule,
    CommunicationModule,
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const { connectionString, database } = config.get("search-engine");
        return {
          uri: connectionString,
          dbName: database,
        };
      },
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceIdInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes("*");
  }
}
