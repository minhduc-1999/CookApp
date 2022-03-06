import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { CommentTargetType } from "enums/comment.enum";
import { CommentPageOption } from ".";

export class GetCommentsRequest extends CommentPageOption {
  @ApiProperty({type: String})
  @IsString()
  targetKeyOrID: string;

  @ApiProperty({ enum: CommentTargetType })
  @IsEnum(CommentTargetType)
  targetType: CommentTargetType
}
