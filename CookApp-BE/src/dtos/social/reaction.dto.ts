import { ApiResponseProperty } from "@nestjs/swagger";
import { ReactionType } from "enums/reaction.enum";

export class ReactionDTO {
  @ApiResponseProperty({ enum: ReactionType })
  type: ReactionType;

  @ApiResponseProperty({ type: String })
  userID: string;

  constructor(reaction?: Partial<ReactionDTO>) {
    this.type = reaction?.type
    this.userID = reaction?.userID
  }
}
