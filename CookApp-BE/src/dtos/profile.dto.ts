import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsEnum,
} from "class-validator";
import { IsMeaningfulString } from "decorators/IsMeaningfulString.decorator";
import { Sex } from "enums/sex.enum";

export class ProfileDTO {
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ type: Number, default: 170 })
  @Expose()
  height?: number;

  @ApiPropertyOptional({ type: Number, default: 40 })
  @IsOptional()
  @IsPositive()  
  @Expose()
  weight?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number, example: new Date().getTime() })
  @IsPositive()
  birthDate?: number;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsMeaningfulString()
  firstName?: string;

  @Expose()
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsMeaningfulString()
  lastName?: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ enum: Sex })
  @IsEnum(Sex)
  sex?: Sex;

  @Expose()
  @IsOptional()
  @IsString()
  fullName?: string;

  constructor(profile?: Partial<ProfileDTO>) {
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
