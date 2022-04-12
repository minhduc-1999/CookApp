import { ApiResponseProperty } from "@nestjs/swagger";
import { MessageResponse } from "base/dtos/response.dto";
import { Message } from "domains/social/conversation.domain";

export class SendMessageResponse extends MessageResponse {
  @ApiResponseProperty({ type: String })
  sessionID: string

  @ApiResponseProperty({ type: Boolean })
  endInteraction: boolean

  constructor(msg: Message, sessionID?: string, end?: boolean) {
    super(msg)
    this.sessionID = sessionID
    this.endInteraction = end
  }

}
