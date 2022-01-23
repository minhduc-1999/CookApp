import { ApiResponseProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class WallDTO extends AuditDTO {
  @ApiResponseProperty({ type: UserDTO })
  user: UserDTO;

  @ApiResponseProperty({ type: [PostDTO] })
  posts: PostDTO[];

  @ApiResponseProperty({ type: Number })
  numberOfFollower: number;

  @ApiResponseProperty({ type: Number })
  numberOfFollowing: number;

  @ApiResponseProperty({ type: Number })
  numberOfPost: number;

  @ApiResponseProperty({ type: [String] })
  followers: string[];

  @ApiResponseProperty({ type: [String] })
  following: string[];
}
