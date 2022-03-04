import {
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsMeaningfulString } from "decorators/isMeaningfulString.decorator";

export class EditPostRequest {
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsMeaningfulString(1)
  @IsOptional()
  content: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @IsOptional()
  addImages?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @IsOptional()
  deleteImages?: string[];

  id: string

  @ApiPropertyOptional({
    description: "Album's name",
    type: String
  })
  @IsMeaningfulString(1)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string
}
