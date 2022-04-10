import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { MessageResponse } from "base/dtos/response.dto";
import { Message } from "domains/social/conversation.domain";

export class GetMessagesResponse {
  @ApiResponseProperty({ type: [MessageResponse] })
  messages: MessageResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(msgs: Message[], meta: PageMetadata) {
    this.messages = msgs?.map(msg => new MessageResponse(msg));
    this.metadata = meta;
  }
}
