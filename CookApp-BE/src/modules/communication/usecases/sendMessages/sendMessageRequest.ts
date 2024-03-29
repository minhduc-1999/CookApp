import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString, IsUUID } from "class-validator"
import { MessageContentType } from "enums/social.enum"

export class SendMessageRequest {
  @ApiProperty({ type: String })
  @IsUUID()
  to: string

  @ApiProperty({ type: String })
  @IsString()
  message: string

  @ApiProperty({ enum: MessageContentType })
  @IsEnum(MessageContentType)
  type: MessageContentType
}
