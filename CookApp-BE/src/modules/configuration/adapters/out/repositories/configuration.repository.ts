import { Inject, Injectable } from "@nestjs/common";
import { NotificationConfiguration } from "domains/social/notificationConfiguration.domain";
import { User } from "domains/social/user.domain";
import { IStorageProvider } from "modules/share/adapters/out/services/provider.service";

export interface IConfigurationRepository {
  addNotificationConfig(user: User, config: NotificationConfiguration): Promise<void>
}

const defaultPath = {
  notificationConfig: "/modules/configurations/notifications/",
};

@Injectable()
export class ConfigurationRepository implements IConfigurationRepository {
  private firestore: FirebaseFirestore.Firestore;
  constructor(
    @Inject("IStorageProvider")
    private _storageProvider: IStorageProvider
  ) {
    this.firestore = this._storageProvider.getFirestore();
  }

  async addNotificationConfig(user: User, config: NotificationConfiguration): Promise<void> {
     await this.firestore
      .doc(defaultPath.notificationConfig + user.id)
      .set({
        ...config
      })
  }
}
