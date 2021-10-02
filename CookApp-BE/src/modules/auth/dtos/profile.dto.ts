import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  IsDateString,
  IsPositive,
} from "class-validator";
import { Sex } from "enums/sex.enum";

export class ProfileDTO {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: Number })
  @ApiPropertyOptional()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  weight?: number;

  @IsDateString()
  @ApiProperty({ type: Date, format: "date" })
  @ApiPropertyOptional()
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
