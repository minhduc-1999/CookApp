import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotificationDTO } from "dtos/social/notification.dto";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
export class NewPostEvent {
  post: PostDTO;
  author: UserDTO;
  constructor(post: PostDTO, author: UserDTO) {
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
    private _wallRepository: IWallRepository
  ) {}

  async handle(event: NewPostEvent): Promise<void> {
    const followers = await this._wallRepository.getFollowers(event.author.id);
    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.NewPostTemplate
    );
    const notification: NotificationDTO = {
      body: template.body.replace("$user", event.author.displayName),
      title: template.title,
      templateId: template.id,
      image: event.author.avatar,
      targets: followers,
      data: {
        postId: event.post.id,
      },
    };
    this._notiRepository.push(notification);
  }
}
