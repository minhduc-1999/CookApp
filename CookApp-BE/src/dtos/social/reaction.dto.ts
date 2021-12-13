import {
  ApiProperty,
} from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
  IsNotEmpty,
} from "class-validator";
import { ReactionType } from "enums/reaction.enum";

export class ReactionDTO {
  @IsNotEmpty()
  @ApiProperty({ enum: ReactionType })
  @Expose()
  type: ReactionType;

  @Expose()
  userId: string;

  static create(reaction: ReactionDTO): ReactionDTO {
    const createdReaction = new ReactionDTO();
    createdReaction.type = reaction.type;
    createdReaction.userId = reaction.userId;
    return createdReaction;
  }
}
