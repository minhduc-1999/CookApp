import { Module } from "@nestjs/common";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { UserModule } from "modules/user/user.module";
import { NotiRepository } from "./adapters/out/repositories/notification.repository";
import { HttpModule } from "@nestjs/axios";
import { NotificationService } from "./adapters/out/services/notification.service";
import { NewPostEventHandler } from "./events/NewPostNotification";
import { NewFollowerEventHandler } from "./events/NewFollowerNotification";
import { ReactPostEventHandler } from "./events/ReactNotification";
import { CommentPostEventHandler } from "./events/CommentNotification";

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

const services = [
  {
    provide: "INotificationService",
    useClass: NotificationService,
  },
];

@Module({
  imports: [
    HttpModule,
    UserModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
  ],
  controllers: [],
  providers: [...eventHandlers, ...repositories, ...services],
  exports: [],
})
export class NotificationModule {}
