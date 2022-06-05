import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetFeedPostsRequest extends PageOptionsDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  tag: string;
}
