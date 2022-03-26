import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { InteractiveTargetType } from "enums/social.enum";

export class GetCommentsRequest extends PageOptionsDto {
  @ApiProperty({ type: String })
  @IsString()
  targetKeyOrID: string;

  @ApiProperty({ enum: InteractiveTargetType })
  @IsEnum(InteractiveTargetType)
  targetType: InteractiveTargetType

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  replyOf: string;
}

