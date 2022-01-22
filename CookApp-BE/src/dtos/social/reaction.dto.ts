import { AuditDTO } from "base/dtos/audit.dto";
import { ReactionType } from "enums/reaction.enum";

export class ReactionDTO extends AuditDTO {
  type: ReactionType;

  userID: string;

  constructor(reaction?: Partial<ReactionDTO>) {
    super()
    this.type = reaction?.type
    this.userID = reaction?.userID
  }
}
