import { Audit } from "../../domains/audit.domain";
import { ConversationType, MessageContentType } from "../../enums/social.enum";
import { User } from "./user.domain";

export class Conversation extends Audit {
  type: ConversationType;

  members: User[]

  lastMessage: Message

  constructor(conversation: Partial<Conversation>) {
    super(conversation)
    this.type = conversation?.type
    this.members = conversation?.members
    this.lastMessage = conversation?.lastMessage
  }

  isSeenAll(lastSeenMsg: Message): boolean {
    if (!this.lastMessage)
      return true
    if (!lastSeenMsg)
      return false
    return lastSeenMsg.id === this.lastMessage.id
  }
}

export class Message extends Audit {
  sender: User

  message: MessageContent

  to: Conversation

  constructor(msg: Partial<Message>) {
    super(msg)
    this.sender = msg?.sender
    this.message = msg?.message
    this.to = msg?.to
  }
}

export class MessageContent {
  content: string

  type: MessageContentType

  constructor(content: string, type: MessageContentType) {
    this.content = content
    this.type = type
  }
}

