import { ApiResponseProperty } from "@nestjs/swagger";
import { AuthorResponse } from "base/dtos/response.dto";
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

  constructor(user: User, isFollowed: boolean = null) {
    super(user)
    this.numberOfFollower = user.nFollowers;
    this.numberOfFollowing = user.nFollowees;
    this.numberOfPost = user.nPosts;
    this.isFollowed = isFollowed;
  }
}
