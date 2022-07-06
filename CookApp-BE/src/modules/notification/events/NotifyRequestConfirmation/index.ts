import { Inject, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RequestConfirmedEvent } from "domains/social/events/request.event";
import { Notification } from "domains/social/notification.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";

@EventsHandler(RequestConfirmedEvent)
export class NotifyRequestConfirmationUseCase
  implements IEventHandler<RequestConfirmedEvent>
{
  private _logger = new Logger(NotifyRequestConfirmationUseCase.name);
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService
  ) {}

  async handle(event: RequestConfirmedEvent): Promise<void> {
    const { request } = event;

    if (!request.sender) {
      this._logger.error(`Sender not found`);
      return;
    }

    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.RequestConfirmationTemplate
    );
    const notification: Notification<{ requestId: string }> = {
      body: template.body,
      title: template.title,
      templateId: template.id,
      image: "success",
      targets: [request.sender.id],
      data: {
        requestId: request.id,
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
    this._logger.log(
      `Send request confirmation notification for user [${request.sender.id}]`
    );
  }
}
