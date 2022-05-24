import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { FoodConfirmedEvent } from "domains/core/events/food.event";
import { Notification } from "domains/social/notification.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";

@EventsHandler(FoodConfirmedEvent)
export class FoodConfirmedEventHandler
  implements IEventHandler<FoodConfirmedEvent>
{
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService
  ) {}

  async handle(event: FoodConfirmedEvent): Promise<void> {
    const { food } = event;

    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.FoodConfirmationTemplate
    );
    const notification: Notification<{ foodID: string }> = {
      body: template.body.replace("$food", food.name),
      title: template.title,
      templateId: template.id,
      image: food.photos[0].url,
      targets: [food.author.id],
      data: {
        foodID: food.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}
