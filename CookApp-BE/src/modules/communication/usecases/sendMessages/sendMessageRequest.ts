import { MessageContent } from "domains/social/chat.domain"

export class SendMessageRequest {
  to: string 

  content: MessageContent
}
