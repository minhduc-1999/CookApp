import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotificationDTO } from "dtos/social/notification.dto";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
export class CommentPostEvent {
  post: PostDTO;
  actor: UserDTO;
  constructor(post: PostDTO, author: UserDTO) {
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
    private _notiRepository: INotiRepository
  ) {}

  async handle(event: CommentPostEvent): Promise<void> {
    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.CommentTemplate
    );
    const notification: NotificationDTO = {
      body: template.body.replace("$user", event.actor.displayName),
      title: template.title,
      templateId: template.id,
      image: event.actor.avatar,
      targets: [event.post.author.id],
      data: {
        postId: event.post.id,
      },
    };
    this._notiRepository.push(notification);
  }
}
