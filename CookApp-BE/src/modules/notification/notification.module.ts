import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { UserModule } from "modules/user/user.module";
import { ConfigModule } from "nestjs-config";
import { NotiRepository } from "./adapters/out/repositories/notification.repository";
import { ReactPostEventHandler } from "./usecases/ReactNotification";
import { NewFollowerEventHandler } from "./usecases/NewFollowerNotification";
import { NewPostEventHandler } from "./usecases/NewPostNotification";
import { CommentPostEventHandler } from "./usecases/CommentNotification";
import { HttpModule } from "@nestjs/axios";

const eventHandlers = [
  NewPostEventHandler,
  NewFollowerEventHandler,
  ReactPostEventHandler,
  CommentPostEventHandler,
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
