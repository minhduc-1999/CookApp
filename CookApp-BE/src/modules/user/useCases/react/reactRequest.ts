import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { ReactionTargetType, ReactionType } from "enums/reaction.enum";

export class ReactRequest {
  @ApiProperty({type: String})
  @IsString()
  targetKeyOrID: string;

  @ApiProperty({ enum: ReactionTargetType})
  @IsEnum(ReactionTargetType)
  targetType: ReactionTargetType

  @ApiProperty({enum: ReactionType})
  @IsEnum(ReactionType)
  react: ReactionType;
}
