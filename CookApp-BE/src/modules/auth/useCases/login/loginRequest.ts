import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, nullable: false, default: "user" })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ type: String, nullable: false, default: "abc12345" })
  readonly password: string;
}
