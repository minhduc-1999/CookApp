import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Notification } from "domains/social/notification.domain";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";
export class NewPostEvent {
  post: Post;
  author: User;
  constructor(post: Post, author: User) {
    this.post = post;
    this.author = author;
  }
}

@EventsHandler(NewPostEvent)
export class NewPostEventHandler implements IEventHandler<NewPostEvent> {
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("IWallRepository")
    private _wallRepository: IWallRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService
  ) { }

  async handle(event: NewPostEvent): Promise<void> {
    const followers = await this._wallRepository.getFollowers(event.author.id);
    if (followers.length === 0) return

    const followerNotiConfigs = await this._configurationService.getNotificationConfigs(followers)
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
      image: event.post.images.length > 0 ? event.post.images[0] : "",
      targets: endFollowers,
      data: {
        postID: event.post.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}