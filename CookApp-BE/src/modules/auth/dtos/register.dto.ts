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
  @ApiProperty({ type: String, example: "user" })
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String , example: "abc12345"})
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: "email", example: "user@gmail.com" })
  email: string;

}
