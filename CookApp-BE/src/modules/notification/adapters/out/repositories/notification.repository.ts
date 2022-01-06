import { Injectable } from "@nestjs/common";
import { BaseBackend } from "@sentry/core";
import { plainToClass } from "class-transformer";
import {
  NotificationDTO,
  NotificationTemplate,
} from "dtos/social/notification.dto";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { initializeApp } from "firebase-admin";
import { applicationDefault, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import _ = require("lodash");
import { NotificationEntity } from "modules/notification/entities/notification.entity";
import { ConfigService } from "nestjs-config";

export interface INotiRepository {
  push(notification: NotificationDTO): Promise<void>;
  getTemplate(path: NotificationTemplateEnum): Promise<NotificationTemplate>;
}

const defaultPath = {
  template: "/modules/notification/templates/",
  users: "/modules/notification/users/",
};
@Injectable()
export class NotiRepository implements INotiRepository {
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
  async getTemplate(
    template: NotificationTemplateEnum
  ): Promise<NotificationTemplate> {
    const tpl = await this.firestore
      .doc(defaultPath.template + template.toString())
      .get();
    return plainToClass(NotificationTemplate, tpl.data());
  }
  async push(notification: NotificationDTO): Promise<void> {
    const batch = this.firestore.batch();
    notification.targets.forEach((target) => {
      const userNotiRef = this.firestore
        .collection(defaultPath.users + `${target}/badge/`)
        .doc();
      const notiEntity = new NotificationEntity(notification);
      batch.set(userNotiRef, {
        ...notiEntity,
      });
    });
    batch.commit();
  }
}
