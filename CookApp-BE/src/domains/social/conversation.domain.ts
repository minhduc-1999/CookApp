import { Audit } from "../../domains/audit.domain";
import { ConversationType, MessageContentType } from "../../enums/social.enum";
import { User } from "./user.domain";

export class Conversation extends Audit {
  type: ConversationType;

  members: User[]

  constructor(conversation: Partial<Conversation>) {
    super(conversation)
    this.type = conversation?.type
    this.members = conversation.members
  }
}

export class Message extends Audit {
  sender: User

  content: MessageContent

  to: Conversation
}

export class MessageContent {
  content: string

  type: MessageContentType
}

