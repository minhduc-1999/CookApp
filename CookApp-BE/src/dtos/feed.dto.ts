import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class FeedDTO extends AuditDTO {
  @Exclude()
  user: UserDTO;

  @Expose()
  @Type(() => PostDTO)
  posts: PostDTO[];

  @Expose()
  numberOfPost: number;

  static create(feed: Pick<FeedDTO, "user">): FeedDTO {
    const createdFeed = new FeedDTO();
    createdFeed.create(feed?.user.id);
    createdFeed.user = feed?.user;
    return createdFeed;
  }
}
