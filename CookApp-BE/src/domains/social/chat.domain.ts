import { Audit } from "domains/audit.domain";
import { CommentMedia } from "./media.domain";
import { User } from "./user.domain";

export class Conversation extends Audit {
  members: User[]

  numOfMessage: number

  numOfMember: number
}

export class MessageContent {
  text: string

  media: CommentMedia[]

  externalLink: string
}

export class Message extends Audit {
  sender: User

  to: Conversation

  content: MessageContent
}

