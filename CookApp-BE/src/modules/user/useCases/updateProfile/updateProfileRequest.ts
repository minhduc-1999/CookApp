import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { IsFileExtensions } from "decorators/isFileExtensions.decorator";
import { IsValidDisplayName } from "decorators/isValidDisplayName.decorator";
import { Profile } from "domains/social/profile.domain";

export class UpdateProfileRequest {
  @IsString()
  @IsValidDisplayName()
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 16)
  @ApiPropertyOptional({ type: String })
  displayName: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty({ each: true })
  @IsFileExtensions(["jpeg", "png", "gif", "svg+xml", "jpg"], { each: true })
  @IsOptional()
  avatar: string;

  @Type(() => Profile)
  @IsOptional()
  @ApiPropertyOptional({ type: Profile })
  profile: Profile;
}
