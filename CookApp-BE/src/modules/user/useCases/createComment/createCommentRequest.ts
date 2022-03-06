import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { CommentTargetType } from "enums/comment.enum";

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

  @ApiProperty({ enum: CommentTargetType })
  @IsEnum(CommentTargetType)
  targetType: "Post" | "RecipeStep"
}
