import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audix.dto";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsEnum,
} from "class-validator";
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

  constructor(profile?: Partial<ProfileDTO>) {
    super(profile);
    this.birthDate = profile?.birthDate;
    this.height = profile?.height;
    this.weight = profile?.weight;
    this.fullName = profile?.fullName;
    this.firstName = profile?.firstName;
    this.lastName = profile?.lastName;
    this.sex = profile?.sex;
  }
}

export class UpdateProfileDTO extends PartialType(ProfileDTO) {}
