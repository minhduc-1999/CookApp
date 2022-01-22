import { AuditDTO } from "base/dtos/audit.dto";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class WallDTO extends AuditDTO {
  user: UserDTO;

  posts: PostDTO[];

  numberOfFollower: number;

  numberOfFollowing: number;

  numberOfPost: number;

  followers: string[];

  following: string[];
}
