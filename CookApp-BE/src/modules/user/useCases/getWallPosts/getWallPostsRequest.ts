import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsEnum, IsOptional } from "class-validator";
import { PostType } from "enums/social.enum";

export class GetWallPostsRequest extends PageOptionsDto {
  @IsEnum(PostType)
  @ApiPropertyOptional({ enum: PostType})
  @IsOptional()
  kind: PostType
}
