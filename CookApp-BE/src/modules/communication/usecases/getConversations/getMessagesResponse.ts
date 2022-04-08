import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { ConversationResponse } from "base/dtos/response.dto";
import { Conversation } from "domains/social/conversation.domain";

export class GetConversationsResponse {
  @ApiResponseProperty({ type: [ConversationResponse] })
  conversations: ConversationResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(conversations: Conversation[], meta: PageMetadata) {
    this.conversations = conversations?.map(conv => new ConversationResponse(conv));
    this.metadata = meta;
  }
}
