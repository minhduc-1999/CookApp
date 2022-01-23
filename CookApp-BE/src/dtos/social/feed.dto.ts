import { ApiResponseProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class FeedDTO extends AuditDTO {
  @ApiResponseProperty({ type: UserDTO })
  user: UserDTO;

  @ApiResponseProperty({ type: [PostDTO] })
  posts: PostDTO[];

  @ApiResponseProperty({ type: Number })
  numberOfPost: number;

  constructor(feed: Partial<FeedDTO>) {
    super(feed)
    this.user = feed?.user
    this.posts = feed?.posts
    this.numberOfPost = feed?.numberOfPost
  }
}
