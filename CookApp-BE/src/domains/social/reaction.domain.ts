import { Audit } from "../../domains/audit.domain";
import { ReactionType } from "enums/social.enum";
import { User } from "./user.domain";
import { IInteractable } from "domains/interfaces/IInteractable.interface";

export class Reaction extends Audit{
  type: ReactionType;

  reactor: User;

  target: IInteractable

  constructor(reaction: Partial<Reaction>) {
    super(reaction)
    this.type = reaction?.type
    this.reactor = reaction?.reactor
    this.target = reaction?.target
  }
}
