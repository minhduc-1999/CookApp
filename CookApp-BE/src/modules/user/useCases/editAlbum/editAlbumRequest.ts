import {
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { WordLength } from "decorators/wordLength.decorator";

export class EditAlbumRequest {
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @WordLength(1)
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String  })
  @IsString()
  @WordLength(1)
  @IsOptional()
  description?: string;

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

  id: string
}
