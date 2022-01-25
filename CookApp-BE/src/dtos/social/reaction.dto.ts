import { ApiResponseProperty } from "@nestjs/swagger";
import { ReactionType } from "enums/reaction.enum";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class ReactionDTO {
  @ApiResponseProperty({ enum: ReactionType })
  type: ReactionType;

  @ApiResponseProperty({ type: UserDTO })
  reactor: UserDTO;

  target: PostDTO

  constructor(reaction: Partial<ReactionDTO>) {
    this.type = reaction?.type
    this.reactor = reaction?.reactor
    this.target = reaction?.target
  }
}
