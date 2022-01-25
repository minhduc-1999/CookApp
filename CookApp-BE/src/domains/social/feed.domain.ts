import { ApiResponseProperty } from "@nestjs/swagger";
import { Audit } from "domains/audit.domain";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Feed extends Audit {
  @ApiResponseProperty({ type: User })
  user: User;

  @ApiResponseProperty({ type: [Post] })
  posts: Post[];

  @ApiResponseProperty({ type: Number })
  numberOfPost: number;

  constructor(feed: Partial<Feed>) {
    super(feed)
    this.user = feed?.user
    this.posts = feed?.posts
    this.numberOfPost = feed?.numberOfPost
  }
}
