import { Inject, Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import {
  Notification,
  NotificationTemplate,
} from "domains/social/notification.domain";
import { NotificationTemplateEnum } from "enums/notification.enum";
import { NotificationEntity } from "modules/notification/entities/notification.entity";
import { IStorageProvider } from "modules/share/adapters/out/services/provider.service";
import { deepLog } from "utils";

export interface INotiRepository {
  push(notification: Notification): Promise<void>;
  getTemplate(path: NotificationTemplateEnum): Promise<NotificationTemplate>;
}

const defaultPath = {
  template: "/modules/notification/templates/",
  users: "/modules/notification/users/",
};
@Injectable()
export class NotiRepository implements INotiRepository {
  private firestore: FirebaseFirestore.Firestore;
  constructor(
    @Inject("IStorageProvider")
    private _storageProvider: IStorageProvider
  ) {
    this.firestore = this._storageProvider.getFirestore();
  }
  async getTemplate(
    template: NotificationTemplateEnum
  ): Promise<NotificationTemplate> {
    const tpl = await this.firestore
      .doc(defaultPath.template + template.toString())
      .get();
    return plainToClass(NotificationTemplate, tpl.data());
  }

  async push(notification: Notification): Promise<void> {
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
    await batch.commit();
  }
}
