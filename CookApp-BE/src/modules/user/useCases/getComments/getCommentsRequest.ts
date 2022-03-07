import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { CommentTargetType } from "enums/comment.enum";

export class GetCommentsRequest extends PageOptionsDto {
  @ApiProperty({type: String})
  @IsString()
  targetKeyOrID: string;

  @ApiProperty({ enum: CommentTargetType })
  @IsEnum(CommentTargetType)
  targetType: "Post" | "RecipeStep"

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  replyOf: string;
}
