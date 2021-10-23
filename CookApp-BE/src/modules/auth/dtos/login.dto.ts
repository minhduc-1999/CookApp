import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: "string", nullable: false })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ type: "string", nullable: false })
  readonly password: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: String })
  accessToken: string;
}
