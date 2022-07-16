import { Inject, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { FoodCreatedEvent } from "domains/core/events/food.event";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";
import { Notification } from "domains/social/notification.domain";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";

@EventsHandler(FoodCreatedEvent)
export class NewFoodEventHandler implements IEventHandler<FoodCreatedEvent> {
  private _logger = new Logger(NewFoodEventHandler.name);
  constructor(
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService,
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository
  ) {}

  async handle(event: FoodCreatedEvent): Promise<void> {
    const { food } = event;
    const [followers, _] = await this._followRepo.getFollowers(food.author.id);

    const followerNotiConfigs =
      await this._configurationService.getNotificationConfigs(
        followers.map((follwer) => follwer.id)
      );
    const notiReceiver = followerNotiConfigs
      .filter((config) => config.newFood)
      .map((config) => config.userID);

    if (notiReceiver.length === 0) return;

    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.NewFoodTemplate
    );

    const notification: Notification<{ foodID: string; foodName: string }> = {
      body: template.body.replace("$user", food.author.displayName),
      title: template.title,
      templateId: template.id,
      image: food.photos[0].url,
      targets: notiReceiver,
      data: {
        foodID: food.id,
        foodName: food.name,
      },
    };
    this._logger.log(
      `Send notification for ${FoodCreatedEvent.name}, food [${food.id}]`
    );
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
  }
}
