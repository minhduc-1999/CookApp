import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import "dotenv/config";
import { AuthModule } from "modules/auth/auth.module";
import { ConfigurationModule } from "modules/configuration/configuration.module";
import { CoreModule } from "modules/core/core.module";
import { Neo4jScheme } from "modules/neo4j/interfaces/config";
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
import { Neo4jModule } from './modules/neo4j/neo4j.module';

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
    Neo4jModule.forRoot({
      scheme: process.env.NEO4J_SCHEME as Neo4jScheme,
      host: process.env.NEO4J_HOST,
      port: process.env.NEO4J_PORT,
      username: process.env.NEO4J_USERNAME,
      password: process.env.NEO4J_PASSWORD,
      database: process.env.NEO4J_DATABASE,
    }),
    ConfigurationModule,
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
