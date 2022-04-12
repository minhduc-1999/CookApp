import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { MessageContentType } from "enums/social.enum"

export class SendMessageRequest {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ type: String })
  botSessionID: string

  @IsUUID()
  @ApiProperty({ type: String })
  to: string

  @ApiProperty({ type: String })
  @IsString()
  message: string

  @ApiProperty({ enum: MessageContentType })
  @IsEnum(MessageContentType)
  type: MessageContentType
}
