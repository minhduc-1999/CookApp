import { ApiResponseProperty } from "@nestjs/swagger";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class WallDTO {
  @ApiResponseProperty({ type: UserDTO })
  user: UserDTO;

  @ApiResponseProperty({ type: [PostDTO] })
  posts: PostDTO[];

  @ApiResponseProperty({ type: Number })
  numberOfFollower: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollowing: number;

  @ApiResponseProperty({ type: Number })
  numberOfPost: number;

  constructor(wall: Partial<WallDTO>){
    this.user = wall.user
    this.numberOfPost = wall.numberOfPost
    this.numberOfFollower = wall.numberOfFollower
    this.numberOfFollowing = wall.numberOfFollowing
  }
}
