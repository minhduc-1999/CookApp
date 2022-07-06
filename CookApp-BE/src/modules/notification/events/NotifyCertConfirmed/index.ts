import { Inject, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CertConfimredEvent } from "domains/social/events/cert.event";
import { Notification } from "domains/social/notification.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";
import { INotificationService } from "modules/notification/adapters/out/services/notification.service";

@EventsHandler(CertConfimredEvent)
export class NotifyCertificateConfirmationUseCase
  implements IEventHandler<CertConfimredEvent>
{
  private _logger = new Logger(NotifyCertificateConfirmationUseCase.name);
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository,
    @Inject("INotificationService")
    private _notiService: INotificationService
  ) {}

  async handle(event: CertConfimredEvent): Promise<void> {
    const { cert } = event;

    if (!cert.owner) {
      this._logger.error(`Owner not found`);
      return;
    }

    const template = await this._notiRepository.getTemplate(
      NotificationTemplateEnum.CertConfirmationTemplate
    );
    const notification: Notification<{certId: string}> = {
      body: template.body.replace("$certNumber", cert.number),
      title: template.title,
      templateId: template.id,
      image: "success",
      targets: [cert.owner.id],
      data: {
        certId: cert.id
      },
    };
    this._notiRepository.push(notification);
    this._notiService.sendNotificationToUser(notification);
    this._logger.log(`Send cert confirmation notification for user [${cert.owner.id}]`)
  }
}
