import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class GetPostMediaRequest {
  postId: string

  @IsUUID()
  @ApiProperty({type: String})
  mid: string

}
