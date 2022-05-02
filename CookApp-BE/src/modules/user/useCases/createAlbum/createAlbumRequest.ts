import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { WordMaxLength } from "decorators/wordMaxLength.decorator";

export class CreateAlbumRequest {
  @WordMaxLength(1)
  @ApiProperty({ type: String, description: "Album's name" })
  name: string

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String  })
  @IsString()
  @WordMaxLength(1)
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  images?: string[];

  @IsString({ each: true })
  @IsArray()
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsFileExtensions(["mp4"], { each: true })
  videos?: string[];

}

