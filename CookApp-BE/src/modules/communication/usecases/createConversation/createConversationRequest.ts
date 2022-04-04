import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ConversationType } from "enums/social.enum";

export class CreateConversationRequest {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  members: string[]

  @ApiPropertyOptional({enum: ConversationType})
  @IsEnum(ConversationType)
  type: ConversationType
}
