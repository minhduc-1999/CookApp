import { Audit } from "../../domains/audit.domain";
import { ReactionType } from "enums/social.enum";
import { Media } from "./media.domain";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Reaction extends Audit{
  type: ReactionType;

  reactor: User;

  target: Post | Media

  constructor(reaction: Partial<Reaction>) {
    super(reaction)
    this.type = reaction?.type
    this.reactor = reaction?.reactor
    this.target = reaction?.target
  }
}
