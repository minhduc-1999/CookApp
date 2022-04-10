import { ApiResponseProperty } from "@nestjs/swagger";
import { AuthorResponse, ConversationResponse } from "base/dtos/response.dto";
import { Conversation } from "domains/social/conversation.domain";
import { User } from "domains/social/user.domain";

export class GetWallResponse extends AuthorResponse {

  @ApiResponseProperty({ type: Number })
  numberOfPost: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollower: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollowing: number;

  @ApiResponseProperty({ type: Boolean })
  isFollowed?: boolean;

  @ApiResponseProperty({ type: ConversationResponse })
  conversation?: ConversationResponse

  constructor(user: User, isFollowed: boolean, conv: Conversation) {
    super(user)
    this.numberOfFollower = user.nFollowers;
    this.numberOfFollowing = user.nFollowees;
    this.numberOfPost = user.nPosts;
    this.isFollowed = isFollowed;
    this.conversation = conv && new ConversationResponse(conv)
  }
}
