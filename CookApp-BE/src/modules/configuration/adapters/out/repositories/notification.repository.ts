import { Injectable } from "@nestjs/common";
import { NotificationConfiguration } from "domains/social/notificationConfiguration.domain";
import { User } from "domains/social/user.domain";
import { initializeApp } from "firebase-admin";
import { applicationDefault, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { ConfigService } from "nestjs-config";

export interface IConfigurationRepository {
  addNotificationConfig(user: User, config: NotificationConfiguration): Promise<void>
}

const defaultPath = {
  notificationConfig: "/modules/configurations/notifications/",
};
@Injectable()
export class ConfigurationRepository implements IConfigurationRepository {
  private firestore: FirebaseFirestore.Firestore;
  constructor(private _configService: ConfigService) {
    const firebaseCredentialPath = this._configService.get(
      "storage.credentialJson"
    );

    if (getApps().length === 0) {
      initializeApp({
        credential: firebaseCredentialPath
          ? cert(firebaseCredentialPath)
          : applicationDefault(),
      });
    }
    this.firestore = getFirestore();
  }
  async addNotificationConfig(user: User, config: NotificationConfiguration): Promise<void> {
     await this.firestore
      .doc(defaultPath.notificationConfig + user.id)
      .set(config)
  }
}
