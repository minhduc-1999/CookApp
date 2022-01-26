export class NotificationTemplate {
  title: string;
  id: string;
  body: string;
}
export class Notification {
  title: string;
  body: string;
  templateId: string;
  data?: object;
  targets: string[];
  image?: string;
}
