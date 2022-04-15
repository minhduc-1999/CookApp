import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { BotResponse, MessageResponse } from "base/dtos/response.dto";
import { Message } from "domains/social/conversation.domain";

@ApiExtraModels(MessageResponse, BotResponse)
export class SendMessageResponse {

  @ApiProperty({
    type: 'object',
    oneOf: [
      { $ref: getSchemaPath(MessageResponse) },
      { $ref: getSchemaPath(BotResponse) }
    ]
  })
  content: MessageResponse | BotResponse

  constructor(dataRes: Message | BotResponse) {
    if (dataRes instanceof Message) {
      this.content = new MessageResponse(dataRes)
    }
    else
      this.content = dataRes
  }

}
