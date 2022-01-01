import { NotificationDTO } from "dtos/social/notification.dto";
import _ = require("lodash");

export class NotificationEntity {
  body: string;
  title: string;
  data: object;
  isRead: boolean;
  createdAt: number;
  templateId: string;
  image: string;

  constructor(noti: NotificationDTO) {
    this.body = noti?.body;
    this.title = noti?.title;
    this.data = noti?.data;
    this.createdAt = _.now();
    this.isRead = false;
    this.image = noti?.image;
    this.templateId = noti?.templateId;
  }
}
