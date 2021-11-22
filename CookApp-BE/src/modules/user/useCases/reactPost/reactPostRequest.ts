import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ReactionType } from "enums/reaction.enum";

export class ReactPostRequest {
  postId: string;

  @ApiProperty({enum: ReactionType})
  @IsEnum(ReactionType)
  react: ReactionType;
}
