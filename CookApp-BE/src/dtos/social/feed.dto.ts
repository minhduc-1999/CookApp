import { AuditDTO } from "base/dtos/audit.dto";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class FeedDTO extends AuditDTO {
  user: UserDTO;

  posts: PostDTO[];

  numberOfPost: number;

  constructor(feed: Partial<FeedDTO>) {
    super()
    this.user = feed?.user
    this.posts = feed?.posts
    this.numberOfPost = feed?.numberOfPost
  }
}
