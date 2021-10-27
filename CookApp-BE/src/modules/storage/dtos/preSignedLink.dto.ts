import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";

export class PreSignedLinkResponse {
  @ApiResponseProperty({ type: String })
  objectName: string;

  @ApiResponseProperty({ type: String })
  signedLink: string;
}

export class PreSignedLinkRequest {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty({ each: true })
  @MinLength(6, { each: true })
  @IsString({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml"], { each: true })
  fileNames: string[];
}
