import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Notification } from "domains/social/notification.domain";
import { User } from "domains/social/user.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";
export class NewFollowerEvent {
  target: User;
  follower: User;
  constructor(follower: User, target: User) {
    this.follower = follower;
    this.target = target;
  }
}

@EventsHandler(NewFollowerEvent)
export class NewFollowerEventHandler
  implements IEventHandler<NewFollowerEvent>
{
  constructor(
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService,
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService
  ) { }

  async handle(event: NewFollowerEvent): Promise<void> {
    const { target, follower } = event

    // Cancel if target user turn off notification for new follower
    const targetNotiConfig = await this._configurationService.getNotificationConfig(target)
    if (!targetNotiConfig.newFollower)
      return

    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.NewFollowerTemplate
    );
    const notification: Notification = {
      body: template.body.replace("$user", event.follower.displayName),
      title: template.title,
      templateId: template.id,
      image: follower.avatar,
      targets: [target.id],
      data: {
        followerID: follower.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}
