import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsEnum,
} from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { MediaType } from "enums/mediaType.enum";

export class PreSignedLinkRequest {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty({ each: true })
  @MinLength(6, { each: true })
  @IsString({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml"], { each: true })
  fileNames: string[];

  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  type: MediaType;
}
