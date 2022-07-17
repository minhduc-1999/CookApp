import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty , IsEmail, IsNumberString} from "class-validator";
import { RoleType } from "enums/system.enum";

export class CreateUserRequest {
  @ApiProperty({ type: String , default: "user100"})
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: String , default: "abc12345"})
  @IsNotEmpty()
  @IsString()
  rawPassword: string;
  
  @ApiProperty({ type: String , default: "user100@gmail.com"})
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String , default: "0913812832"})
  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  phone: string;

  @ApiProperty({ type: String , default: "sys-admin"})
  @IsNotEmpty()
  @IsString()
  role: RoleType;
}
