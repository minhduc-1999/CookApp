import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
} from "class-validator";

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

}
