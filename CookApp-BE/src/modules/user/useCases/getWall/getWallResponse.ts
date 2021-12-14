import { ApiResponseProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { WallDTO } from "dtos/social/wall.dto";

class User {
  @ApiResponseProperty({ type: String })
  avatar: string;
  @ApiResponseProperty({ type: String })
  displayName: string;
  @ApiResponseProperty({ type: String })
  id: string;
}

export class GetWallResponse {
  @Type(() => User)
  @ApiResponseProperty({ type: User })
  user: User;

  @ApiResponseProperty({ type: Number })
  numberOfPost: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollower: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollowing: number;

  @ApiResponseProperty({ type: Boolean })
  isFollowed?: boolean;

  constructor(wall: WallDTO, isFollowed: boolean = null) {
    this.user = {
      avatar: wall.user.avatar,
      id: wall.user.id,
      displayName: wall.user.displayName,
    };
    this.numberOfFollower = wall.numberOfFollower;
    this.numberOfFollowing = wall.numberOfFollowing;
    this.numberOfPost = wall.numberOfPost;
    this.isFollowed = isFollowed;
  }
}
