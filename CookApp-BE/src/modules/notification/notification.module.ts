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
import { ConfigurationModule } from "modules/configuration/configuration.module";
import { FoodConfirmedEventHandler } from "./events/FoodConfirmedNotification";
import { NewFoodEventHandler } from "./events/NewFoodNotification";
import { NotifyCertificateConfirmationUseCase } from "./events/NotifyCertConfirmed";

const eventHandlers = [
  NewPostEventHandler,
  NewFollowerEventHandler,
  ReactPostEventHandler,
  CommentPostEventHandler,
  FoodConfirmedEventHandler,
  NewFoodEventHandler,
  NotifyCertificateConfirmationUseCase
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
    ConfigurationModule,
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
