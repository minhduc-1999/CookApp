import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { WordLength } from "decorators/wordLength.decorator";

export class EditPostRequest {
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordLength(1)
  @IsOptional()
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

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordLength(1)
  @IsOptional()
  shouldAdvice?: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordLength(1)
  @IsOptional()
  shouldNotAdvice?: string;

  @IsUUID(4, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  shouldFoodIds?: string[];

  @IsUUID(4, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  shouldNotFoodIds?: string[];

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordLength(1)
  @IsOptional()
  title?: string;

  @IsUUID(4)
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  foodRefId?: string

  id: string;
}
