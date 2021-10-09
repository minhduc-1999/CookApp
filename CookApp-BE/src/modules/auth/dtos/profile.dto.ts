import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audix.dto";
import { IsString, IsNotEmpty, IsOptional, IsPositive, IsEnum } from "class-validator";
import { IsMeaningfullString } from "decorators/IsMeaningfullString.decorator";
import { Sex } from "enums/sex.enum";

export class ProfileDTO extends AuditDTO {
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ type: Number, default: 170 })
  height?: number;

  @ApiPropertyOptional({ type: Number, default: 40 })
  @IsOptional()
  @IsPositive()
  weight?: number;

  @ApiPropertyOptional({ type: Number, example: new Date().getTime() })
  @IsPositive()
  birthDate?: number;

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsMeaningfullString()
  firstName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsMeaningfullString()
  lastName?: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: Sex })
  @IsEnum(Sex)
  sex?: Sex;

  @IsOptional()
  @IsString()
  fullName?: string;

  constructor(profile: Partial<ProfileDTO>) {
    super(profile);
    if (profile.birthDate) this.birthDate = profile.birthDate;
    if (profile.height) this.height = profile.height;
    if (profile.weight) this.weight = profile.weight;
    if (profile.fullName) this.fullName = profile.fullName;
    if (profile.firstName) this.firstName = profile.firstName;
    if (profile.lastName) this.lastName = profile.lastName;
    if (profile.sex) this.sex = profile.sex;
  }
}

export class UpdateProfileDTO extends PartialType(ProfileDTO) {}
