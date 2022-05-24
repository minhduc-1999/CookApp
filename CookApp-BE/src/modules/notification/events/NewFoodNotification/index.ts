import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { FoodCreatedEvent } from "domains/core/events/food.event";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";
import { Notification } from "domains/social/notification.domain";

@EventsHandler(FoodCreatedEvent)
export class NewFoodEventHandler
  implements IEventHandler<FoodCreatedEvent>
{
  constructor(
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService,
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository
  ) {}

  async handle(event: FoodCreatedEvent): Promise<void> {
    const { food } = event;
    const [followers, _] = await this._followRepo.getFollowers(food.author.id);

    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.NewFoodTemplate
    );
    const notification: Notification<{ foodID: string }> = {
      body: template.body.replace("$user", food.author.displayName),
      title: template.title,
      templateId: template.id,
      image: food.photos[0].url,
      targets: followers.map((user) => user.id),
      data: {
        foodID: food.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}
