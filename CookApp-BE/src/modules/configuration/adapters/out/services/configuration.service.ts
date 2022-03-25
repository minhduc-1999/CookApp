import { Inject, Injectable } from "@nestjs/common";
import { NotificationConfiguration } from "domains/social/notificationConfiguration.domain";
import { User } from "domains/social/user.domain";
import { IStorageProvider } from "modules/share/adapters/out/services/provider.service";

export interface IConfigurationService {
  setupConfigForNewUser(user: User): Promise<void>
  getNotificationConfig(user: User): Promise<NotificationConfiguration>
  getNotificationConfigs(users: string[]): Promise<NotificationConfiguration[]>
}

const collections = {
  notificationConfig: "/modules/configurations/notifications/",
};

@Injectable()
export class ConfigurationService implements IConfigurationService {
  private firestore: FirebaseFirestore.Firestore;
  constructor(
    @Inject("IStorageProvider")
    private _storageProvider: IStorageProvider
  ) {
    this.firestore = this._storageProvider.getFirestore();
  }
  async getNotificationConfigs(users: string[]): Promise<NotificationConfiguration[]> {
    const notiConfigsRef = this.firestore.collection(collections.notificationConfig)
    const snapshot = await notiConfigsRef.where('userID', "in", users).get()
    if (snapshot.empty)
      return null

    return snapshot.docs.map(doc => doc.data() as NotificationConfiguration)
  }

  async getNotificationConfig(user: User): Promise<NotificationConfiguration> {
    const doc = await this.firestore.doc(collections.notificationConfig + user.id).get()
    return doc.data() as NotificationConfiguration
  }

  async setupConfigForNewUser(user: User): Promise<void> {
    const config = new NotificationConfiguration(user.id)
    await this.firestore
      .doc(collections.notificationConfig + user.id)
      .set({
        ...config,
      })
  }
}
