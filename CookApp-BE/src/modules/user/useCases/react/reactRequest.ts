import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { InteractiveTargetType, ReactionType } from "enums/social.enum";

export class ReactRequest {
  @ApiProperty({type: String})
  @IsString()
  targetKeyOrID: string;

  @ApiProperty({ enum: InteractiveTargetType})
  @IsEnum(InteractiveTargetType)
  targetType: InteractiveTargetType

  @ApiProperty({enum: ReactionType})
  @IsEnum(ReactionType)
  react: ReactionType;
}
