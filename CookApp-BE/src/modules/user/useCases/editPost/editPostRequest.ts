import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsMeaningfulString } from "decorators/IsMeaningfulString.decorator";

export class EditPostRequest {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  @IsMeaningfulString(2)
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
}
