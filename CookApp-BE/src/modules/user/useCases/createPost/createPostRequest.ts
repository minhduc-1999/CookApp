import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { WordMaxLength } from "decorators/wordMaxLength.decorator";
import { PostType } from "enums/social.enum";

export class CreatePostRequest {
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String, description: "Moment's content" })
  @IsString()
  @WordMaxLength(1)
  @IsOptional()
  content?: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordMaxLength(1)
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

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  foodRefId?: string;

  @IsArray()
  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];
}
