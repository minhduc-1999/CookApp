import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { Notification } from "domains/social/notification.domain";
import { ConfigService } from "nestjs-config";

export interface INotificationService {
  sendNotificationToSegment(message: Notification): Promise<void>;
  sendNotificationToUser(message: Notification): Promise<void>;
}

type OneSignalPayload = {
  app_id: string;
  contents: object;
  included_segments?: string[];
  include_external_user_ids?: string[];
  name: string;
  headings: object;
  data?: object;
  channel_for_external_user_ids?: string;
  large_icon?: string;
};

@Injectable()
export class NotificationService implements INotificationService {
  private apiKey: string;
  private apiUrl: string;
  private appID: string;
  private _logger = new Logger(Notification.name);
  constructor(
    private _configService: ConfigService,
    private readonly _httpService: HttpService
  ) {
    this.apiKey = _configService.get("notification.apiKey");
    this.appID = _configService.get("notification.appID");
    this.apiUrl =
      _configService.get("notification.apiBaseUrl") + "v1/notifications";
  }
  sendNotificationToSegment(message: Notification): Promise<void> {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Basic ${this.apiKey}`,
    };

    const data: OneSignalPayload = {
      app_id: this.appID,
      contents: { en: message.body },
      headings: { en: message.title },
      included_segments: message.targets,
      name: "test 1",
      data: {
        ...message.data,
        template_id: message.templateId,
      },
      large_icon: message.image,
    };
    this._httpService.post(this.apiUrl, data, { headers }).subscribe({
      next: (result) =>
        this._logger.log(
          `Success to send push notification to ${result.data.recipients}`
        ),
      error: (err) =>
        this._logger.error(`Failed to send push notification`, err),
    });
    return;
  }
  sendNotificationToUser(message: Notification): Promise<void> {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Basic ${this.apiKey}`,
    };

    const data: OneSignalPayload = {
      app_id: this.appID,
      contents: { en: message.body },
      headings: { en: message.title },
      channel_for_external_user_ids: "push",
      include_external_user_ids: message.targets,
      name: "test 1",
      data: {
        ...message.data,
        template_id: message.templateId,
      },
      large_icon: message.image,
    };
    this._httpService.post(this.apiUrl, data, { headers }).subscribe({
      next: (result) =>
        this._logger.log(
          `Success to send push notification to ${result.data.recipients}`
        ),
      error: (err) =>
        this._logger.error(`Failed to send push notification`, err),
    });
    return;
  }
}
