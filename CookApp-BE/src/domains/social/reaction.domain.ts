import { ReactionType } from "enums/social.enum";
import { Media } from "./media.domain";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Reaction {
  type: ReactionType;

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
