import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsMeaningfulString } from "decorators/isMeaningfulString.decorator";
import { PostType } from "enums/social.enum";

export class CreatePostRequest {
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String, description: "Moment's content" })
  @IsString()
  @IsMeaningfulString(1)
  @IsOptional()
  content?: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String  })
  @IsString()
  @IsMeaningfulString(1)
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
  videos?: string[];

  @IsEnum(PostType)
  @ApiProperty({ enum: PostType })
  kind: "ALBUM" | "MOMENT"

  @IsOptional()
  @IsMeaningfulString(1)
  @ApiPropertyOptional({ type: String, description: "Album's name" })
  @IsOptional()
  name?: string
}

