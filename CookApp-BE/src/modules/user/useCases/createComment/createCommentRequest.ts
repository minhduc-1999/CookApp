import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { InteractiveTargetType } from "enums/social.enum";

export class CreateCommentRequest {
  @ApiProperty({type: String})
  @IsString()
  targetKeyOrID: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  content: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  replyFor: string;

  @ApiProperty({ enum: InteractiveTargetType })
  @IsEnum(InteractiveTargetType)
  targetType: "POST" | "RECIPE_STEP" | "MEDIA"
}
