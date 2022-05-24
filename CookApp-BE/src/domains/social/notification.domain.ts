export class NotificationTemplate {
  title: string;
  id: string;
  body: string;
}
export class Notification<T = object> {
  title: string;
  body: string;
  templateId: string;
  data?: T;
  targets: string[];
  image?: string;
}
