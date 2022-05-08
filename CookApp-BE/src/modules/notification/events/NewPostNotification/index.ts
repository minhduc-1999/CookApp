import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PostCreatedEvent } from "domains/social/events/post.event";
import { Notification } from "domains/social/notification.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";

@EventsHandler(PostCreatedEvent)
export class NewPostEventHandler implements IEventHandler<PostCreatedEvent> {
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService,
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
  ) { }

  async handle(event: PostCreatedEvent): Promise<void> {
    const [followers, _] = await this._followRepo.getFollowers(event.author.id);
    if (followers.length === 0) return

    const followerNotiConfigs = await this._configurationService
      .getNotificationConfigs(followers.map(follwer => follwer.id))
    const endFollowers = followerNotiConfigs
      .filter(config => config.newPost)
      .map(config => config.userID)

    if (endFollowers.length === 0)
      return

    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.NewPostTemplate
    );
    const notification: Notification = {
      body: template.body.replace("$user", event.author.displayName),
      title: template.title,
      templateId: template.id,
      image: event.post.medias.length > 0 ? event.post.medias[0].url : "",
      targets: endFollowers,
      data: {
        postID: event.post.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}
