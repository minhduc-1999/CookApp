import { ApiResponseProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { ReactionType } from "enums/reaction.enum";

export class ReactionDTO extends AuditDTO {
  @ApiResponseProperty({ enum: ReactionType })
  type: ReactionType;

  @ApiResponseProperty({ type: String })
  userID: string;

  constructor(reaction?: Partial<ReactionDTO>) {
    super(reaction)
    this.type = reaction?.type
    this.userID = reaction?.userID
  }
}
