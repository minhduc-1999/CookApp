import { ApiResponseProperty } from "@nestjs/swagger";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Wall {
  @ApiResponseProperty({ type: User })
  user: User;

  @ApiResponseProperty({ type: [Post] })
  posts: Post[];

  @ApiResponseProperty({ type: Number })
  numberOfFollower: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollowing: number;

  @ApiResponseProperty({ type: Number })
  numberOfPost: number;

  constructor(wall: Partial<Wall>){
    this.user = wall.user
    this.numberOfPost = wall.numberOfPost
    this.numberOfFollower = wall.numberOfFollower
    this.numberOfFollowing = wall.numberOfFollowing
  }
}
