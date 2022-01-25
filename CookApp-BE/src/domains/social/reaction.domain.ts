import { ApiResponseProperty } from "@nestjs/swagger";
import { ReactionType } from "enums/reaction.enum";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Reaction {
  @ApiResponseProperty({ enum: ReactionType })
  type: ReactionType;

  @ApiResponseProperty({ type: User })
  reactor: User;

  target: Post

  constructor(reaction: Partial<Reaction>) {
    this.type = reaction?.type
    this.reactor = reaction?.reactor
    this.target = reaction?.target
  }
}
