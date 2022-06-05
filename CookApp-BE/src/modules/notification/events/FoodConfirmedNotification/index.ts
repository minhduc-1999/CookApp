import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { FoodCensorshipEvent } from "domains/core/events/food.event";
import {
  Notification,
  NotificationTemplate,
} from "domains/social/notification.domain";
import { FoodStatusType } from "enums/core.enum";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";

@EventsHandler(FoodCensorshipEvent)
export class FoodConfirmedEventHandler
  implements IEventHandler<FoodCensorshipEvent>
{
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService,
    @Inject("INotificationService")
    private _notiService: INotificationService
  ) {}

  async handle(event: FoodCensorshipEvent): Promise<void> {
    const { food } = event;

    const notiConfig = await this._configurationService.getNotificationConfig(
      food.author
    );

    //Cancle if user dont want to receive notification for food confirmation
    if (!notiConfig?.foodConfirmation) return;

    let template: NotificationTemplate;
    if (food.status === FoodStatusType.CONFIRMED) {
      template = await this._notiRepository.getTemplate(
        NotificationTemplateEnum.FoodConfirmationTemplate
      );
    } else
      template = await this._notiRepository.getTemplate(
        NotificationTemplateEnum.FoodDismissionTemplate
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
