import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { UserModule } from "modules/user/user.module";
import { ConfigModule } from "nestjs-config";
import { NotiRepository } from "./adapters/out/repositories/notification.repository";
import { ReactPostEventHandler } from "./usecases/LikeNotification";
import { NewFollowerEventHandler } from "./usecases/NewFollowerNotification";
import { NewPostEventHandler } from "./usecases/NewPostNotification";

const eventHandlers = [
  NewPostEventHandler,
  NewFollowerEventHandler,
  ReactPostEventHandler,
];

const repositories = [
  {
    provide: "INotiRepository",
    useClass: NotiRepository,
  },
];

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([]),
    JwtModule.register({
      secret: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [...eventHandlers, ...repositories],
  exports: [],
})
export class NotificationModule {}
