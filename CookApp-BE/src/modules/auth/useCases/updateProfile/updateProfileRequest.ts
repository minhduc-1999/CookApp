import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsValidDisplayName } from "decorators/isValidDisplayName.decorator";
import { ProfileDTO } from "dtos/profile.dto";

export class UpdateProfileRequest {
  @IsString()
  @IsValidDisplayName()
  @IsOptional()
  @IsNotEmpty()
  @Length(8, 16)
  @ApiPropertyOptional({ type: String })
  displayName: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @IsOptional()
  avatar: string;

  @Type(() => ProfileDTO)
  @IsOptional()
  @ApiPropertyOptional({ type: ProfileDTO })
  profile: ProfileDTO;
}
