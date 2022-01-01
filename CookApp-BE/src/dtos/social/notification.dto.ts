import { AggregateRoot } from "@nestjs/cqrs";
import { NewPostEvent } from "modules/notification/usecases/NewPostNotification";

export class NotificationTemplate {
  title: string;
  body: string;
}
export class Notification extends AggregateRoot {
  title: string;
  body: string;
  template_id: string;
  data: object;

  push() {
    this.apply(new NewPostEvent());
  }
}
