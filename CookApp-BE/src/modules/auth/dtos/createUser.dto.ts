import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ProfileDTO } from "./profile.dto";

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String , example: "passwordexample"})
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: "email" })
  email: string;

  @ApiProperty({ type: String , example: "+84932124421"})
  @IsOptional()
  @IsPhoneNumber('VN')
  @ApiPropertyOptional()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @ApiProperty({ type: String })
  @ApiPropertyOptional()
  @IsNotEmpty()
  avatar?: string;

  @ApiProperty({ type: ProfileDTO })
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileDTO)
  profile?: ProfileDTO;
}
