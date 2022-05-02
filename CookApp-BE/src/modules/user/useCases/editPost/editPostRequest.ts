import {
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { WordMaxLength } from "decorators/wordMaxLength.decorator";

export class EditPostRequest {
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordMaxLength(1)
  @IsOptional()
  content: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String  })
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
  addImages?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsUUID("4", { each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  deleteImages?: string[];

  @IsArray()
  @ApiPropertyOptional({ type: [String] })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  tags: string[];

  id: string
}
