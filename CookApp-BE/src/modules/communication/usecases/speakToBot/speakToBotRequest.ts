import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { MessageContentType } from "enums/social.enum"

export class SpeakToBotRequest {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String })
  botSessionID: string

  @ApiProperty({ type: String })
  @IsString()
  message: string

  @ApiProperty({ enum: MessageContentType })
  @IsEnum(MessageContentType)
  type: MessageContentType
}
