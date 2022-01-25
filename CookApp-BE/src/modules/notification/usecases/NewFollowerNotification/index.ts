import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Notification } from "domains/social/notification.domain";
import { User } from "domains/social/user.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";
export class NewFollowerEvent {
  targetID: string;
  follower: User;
  constructor(follower: User, targetID: string) {
    this.follower = follower;
    this.targetID = targetID;
  }
}

@EventsHandler(NewFollowerEvent)
export class NewFollowerEventHandler
  implements IEventHandler<NewFollowerEvent>
{
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService
  ) {}

  async handle(event: NewFollowerEvent): Promise<void> {
    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.NewFollowerTemplate
    );
    const notification: Notification = {
      body: template.body.replace("$user", event.follower.displayName),
      title: template.title,
      templateId: template.id,
      image: event.follower.avatar,
      targets: [event.targetID],
      data: {
        followerID: event.follower.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}
