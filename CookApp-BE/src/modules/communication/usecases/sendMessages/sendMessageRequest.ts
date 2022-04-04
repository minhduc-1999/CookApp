import { IsEnum, IsString, IsUUID } from "class-validator"
import { MessageContentType } from "enums/social.enum"

export class SendMessageRequest {
  @IsUUID()
  to: string 

  @IsString()
  message: string
  
  @IsEnum(MessageContentType)
  type: MessageContentType
}
