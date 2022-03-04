import { ApiResponseProperty } from "@nestjs/swagger";
import { AuthorResponse } from "base/dtos/response.dto";
import { Wall } from "domains/social/wall.domain";

export class GetWallResponse {
  @ApiResponseProperty({ type: AuthorResponse })
  user: AuthorResponse;

  @ApiResponseProperty({ type: Number })
  numberOfPost: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollower: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollowing: number;

  @ApiResponseProperty({ type: Boolean })
  isFollowed?: boolean;

  constructor(wall: Wall, isFollowed: boolean = null) {
    this.user = new AuthorResponse(wall.user)
    this.numberOfFollower = wall.numberOfFollower;
    this.numberOfFollowing = wall.numberOfFollowing;
    this.numberOfPost = wall.numberOfPost;
    this.isFollowed = isFollowed;
  }
}
