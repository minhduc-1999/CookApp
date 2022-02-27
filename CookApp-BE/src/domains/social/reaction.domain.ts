import { ApiResponseProperty } from "@nestjs/swagger";
import { ReactionType } from "enums/reaction.enum";
import { Media } from "./media.domain";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Reaction {
  @ApiResponseProperty({ enum: ReactionType })
  type: ReactionType;

  @ApiResponseProperty({ type: User })
  reactor: User;

  target: Post | Media

  constructor(reaction: Partial<Reaction>) {
    this.type = reaction?.type
    this.reactor = reaction?.reactor
    this.target = reaction?.target
  }

  public setTarget(target: Post | Media) {
    this.target = target
  }
}
