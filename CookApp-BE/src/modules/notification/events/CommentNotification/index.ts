import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Notification } from "domains/social/notification.domain";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";
export class CommentPostEvent {
  post: Post;
  actor: User;
  constructor(post: Post, author: User) {
    this.post = post;
    this.actor = author;
  }
}

@EventsHandler(CommentPostEvent)
export class CommentPostEventHandler
  implements IEventHandler<CommentPostEvent>
{
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService
  ) {}

  async handle(event: CommentPostEvent): Promise<void> {
    const { actor, post } = event;

    if (actor.id === post.author.id) {
      return;
    }
    const authorNotiConfig =
      await this._configurationService.getNotificationConfig(post.author);

    // Cancle if post's author turn off notification for new comment
    if (!authorNotiConfig.postComment) return;

    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.CommentTemplate
    );
    const notification: Notification<{ postID: string }> = {
      body: template.body.replace("$user", actor.displayName),
      title: template.title,
      templateId: template.id,
      image: actor.avatar.url,
      targets: [post.author.id],
      data: {
        postID: post.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}
