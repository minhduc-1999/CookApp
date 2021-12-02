import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class WallDTO extends AuditDTO {
  @Expose()
  @Type(() => UserDTO)
  user: UserDTO;

  @Type(() => PostDTO)
  @Expose()
  posts: PostDTO[];

  @Expose()
  numberOfFollower: number;

  @Expose()
  numberOfFollowing: number;

  @Expose()
  numberOfPost: number;

  followers: string[];

  following: string[];

  static create(wall: Pick<WallDTO, "user">): WallDTO {
    const newWall = new WallDTO();
    newWall.create(wall.user.id);
    newWall.user = wall?.user;
    return newWall;
  }
}
