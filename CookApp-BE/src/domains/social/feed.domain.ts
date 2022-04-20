import { Audit } from "../../domains/audit.domain";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Feed extends Audit {
  user: User;

  posts: Post[];

  constructor(feed: Partial<Feed>) {
    super(feed)
    this.user = feed?.user
    this.posts = feed?.posts
  }
}
