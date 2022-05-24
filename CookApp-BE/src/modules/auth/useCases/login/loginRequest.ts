import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, nullable: false, default: "user" })
  @Length(3,20)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8,20)
  @ApiProperty({ type: String, nullable: false, default: "abc12345" })
  readonly password: string;
}
