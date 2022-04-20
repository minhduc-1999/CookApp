import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { ConversationResponse } from "base/dtos/response.dto";

export class GetConversationsResponse {
  @ApiResponseProperty({ type: [ConversationResponse] })
  conversations: ConversationResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(convRess: ConversationResponse[], meta: PageMetadata) {
    this.conversations = convRess
    this.metadata = meta;
  }
}
