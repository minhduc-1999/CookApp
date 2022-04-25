import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsValidDisplayName } from "decorators/isValidDisplayName.decorator";
import { Sex } from "enums/social.enum";
import _ = require("lodash");

export class UpdateProfileRequest {
  @IsString()
  @IsValidDisplayName()
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiPropertyOptional({ type: String })
  displayName: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @IsOptional()
  avatar: string;

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Min(0)
  height?: number;

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @Min(0)
  weight?: number;

  @IsOptional()
  @ApiPropertyOptional({ type: Number, default: _.now()})
  @Min(0)
  birthDate?: number;

  @IsString()
  @IsValidDisplayName()
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 50)
  @ApiPropertyOptional({ type: String })
  firstName?: string;

  @IsString()
  @IsValidDisplayName()
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 50)
  @ApiPropertyOptional({ type: String })
  lastName?: string;

  @ApiPropertyOptional({ enum: Sex })
  @IsEnum(Sex)
  @IsOptional()
  sex?: Sex;

}
