import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import "dotenv/config";
import { AuthModule } from "modules/auth/auth.module";
import { CoreModule } from "modules/core/core.module";
import { NotificationModule } from "modules/notification/notification.module";
import { UserModule } from "modules/user/user.module";
import { RavenModule } from "nest-raven";
import { ConfigModule, ConfigService } from "nestjs-config";
import * as path from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import "./boilerplate.polyfill";
import { TraceIdInterceptor } from "./interceptors/trace-id-interceptor.service";
import { contextMiddleware } from "./middleware/context.middleware";

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, "config", "**/!(*.d).{ts,js}")),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const { connectionString, database } = config.get("database");
        return {
          uri: connectionString,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    RavenModule,
    AuthModule,
    UserModule,
    CoreModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceIdInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransactionInterceptor,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes("*");
  }
}
