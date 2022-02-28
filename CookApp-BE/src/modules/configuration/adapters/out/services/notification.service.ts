import { Inject, Injectable, Logger } from "@nestjs/common";
import { Notification } from "domains/social/notification.domain";
import { NotificationConfiguration } from "domains/social/notificationConfiguration.domain";
import { User } from "domains/social/user.domain";
import { IConfigurationRepository } from "../repositories/notification.repository";

export interface IConfigurationService {
  setupConfigForNewUser(user: User): Promise<void>
}

@Injectable()
export class ConfigurationService implements IConfigurationService {
  private _logger = new Logger(Notification.name);
  constructor(
    @Inject("IConfigurationRepository")
    private _configurationRepo: IConfigurationRepository
  ) {
  }
  async setupConfigForNewUser(user: User): Promise<void> {
    const notiConfig = new NotificationConfiguration()
    await this._configurationRepo.addNotificationConfig(user, notiConfig)
  }
}
