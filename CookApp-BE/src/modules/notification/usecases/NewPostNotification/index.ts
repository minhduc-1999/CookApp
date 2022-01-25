import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotificationDTO } from "dtos/social/notification.dto";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";
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
    private _wallRepository: IWallRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService
  ) {}

  async handle(event: NewPostEvent): Promise<void> {
    const followers = await this._wallRepository.getFollowers(event.author.id);
    if (followers.length === 0) return
    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.NewPostTemplate
    );
    const notification: NotificationDTO = {
      body: template.body.replace("$user", event.author.displayName),
      title: template.title,
      templateId: template.id,
      image: event.post.images.length > 0 ? event.post.images[0] : "",
      targets: followers,
      data: {
        postID: event.post.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}
