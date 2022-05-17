import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { WordLength } from "decorators/wordLength.decorator";
import { PostType } from "enums/social.enum";

class RecommendationRequest {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "Recommendation's content" })
  @IsString()
  @WordLength(1)
  advice: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(4, { each: true })
  @ArrayNotEmpty()
  foodIds: string[];
}

export class CreatePostRequest {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "Moment's content" })
  @IsString()
  @WordLength(1)
  content: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordLength(1)
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @IsOptional()
  images?: string[];

  @IsString({ each: true })
  @IsArray()
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsFileExtensions(["mp4"], { each: true })
  videos?: string[];

  @IsEnum(PostType)
  @ApiProperty({ enum: PostType })
  kind: PostType;

  @IsUUID(4)
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  foodRefId?: string;

  @IsArray()
  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayNotEmpty()
  tags: string[];

  @ApiPropertyOptional({ type: RecommendationRequest})
  @ValidateNested()
  @Type(() => RecommendationRequest)
  @IsOptional()
  should?: RecommendationRequest

  @ApiPropertyOptional({ type: RecommendationRequest})
  @ValidateNested()
  @IsOptional()
  @Type(() => RecommendationRequest)
  shouldNot?: RecommendationRequest
}
