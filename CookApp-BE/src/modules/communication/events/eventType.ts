import { Message } from "domains/social/conversation.domain"

export const ChatEventType = {
  IN_MESSAGE: "chat:send",
  CHAT_ERROR: "chat:error",
  OUT_MSG: "chat:message"
}

export class NewMessageEvent {
  message: Message
  constructor(msg: Message) {
    this.message = msg
  }
}
