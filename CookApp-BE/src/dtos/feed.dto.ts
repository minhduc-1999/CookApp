import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude, Type } from "class-transformer";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class FeedDTO extends AuditDTO {
  @Exclude()
  user: Partial<UserDTO>;

  @Type(() => PostDTO)
  posts: Partial<PostDTO>[];

  numberOfPost: number;

  constructor(feed: Partial<FeedDTO>) {
    super(feed);
    this.id = feed?.id;
    this.posts = feed?.posts;
    this.user = feed?.user;
    this.numberOfPost = feed?.numberOfPost;
  }
}
