import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude, Type } from "class-transformer";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class WallDTO extends AuditDTO {
  
  @Exclude()
  user: Pick<UserDTO, 'id' | 'avatar'>;

  @Type(() => PostDTO)
  posts: Omit<PostDTO, 'author'>[];

  numberOfFollower: number 

  numberOfFollowing: number

  numberOfPost: number

  constructor(wall: Partial<WallDTO>) {
    super(wall);
    this.id = wall?.id;
    this.posts = wall?.posts;
    this.user = wall?.user
  }
}
