import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsPositive,
} from "class-validator";
import { Sex } from "enums/sex.enum";

export class UpdateProfileDTO {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: Number, default: 170 })
  @ApiPropertyOptional()
  @IsPositive()
  height?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number , default: 40})
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  weight?: number;

  @IsDateString()
  @ApiProperty({ type: Date, format: "date" })
  @ApiPropertyOptional()
  @IsNotEmpty()
  birthDate?: Date;

  @ApiProperty({ type: String })
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @ApiProperty({ enum: Sex })
  @ApiPropertyOptional()
  sex?: Sex;
}

export type ProfileDTO = NonNullable<UpdateProfileDTO>;
