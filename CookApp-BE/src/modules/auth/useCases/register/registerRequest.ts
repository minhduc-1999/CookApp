import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
} from "class-validator";

export class RegisterRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: "user" })
  @IsNotEmpty()
  @Length(3,20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String , example: "abc12345"})
  @Length(8, 20)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: "email", example: "user@gmail.com" })
  email: string;
}
