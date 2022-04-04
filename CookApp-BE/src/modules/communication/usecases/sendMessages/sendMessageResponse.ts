import { AuditResponse } from "base/dtos/response.dto"
import { Message } from "domains/social/conversation.domain"
import { MessageContentType } from "enums/social.enum"

export class SendMessageResponse extends AuditResponse {
  to: string

  message: string

  type: MessageContentType

  constructor(msg: Message) {
    super(msg)
    this.to = msg?.to?.id
    this.message = msg?.message?.content
    this.type = msg?.message?.type
  }
}
