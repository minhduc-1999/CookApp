import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Wall {
  user: User;

  posts: Post[];

  numberOfFollower: number;

  numberOfFollowing: number;

  numberOfPost: number;

  constructor(wall: Partial<Wall>){
    this.user = wall.user
    this.numberOfPost = wall.numberOfPost
    this.numberOfFollower = wall.numberOfFollower
    this.numberOfFollowing = wall.numberOfFollowing
  }
}
