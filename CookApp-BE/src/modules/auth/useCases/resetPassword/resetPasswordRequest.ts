import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { RESET_PASSWORD_TOKEN_LENGTH } from "../requestResetPassword";

export class ResetPasswordRequest {
  @ApiProperty({ type: String })
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @Length(8, 20)
  newPassword: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(RESET_PASSWORD_TOKEN_LENGTH, RESET_PASSWORD_TOKEN_LENGTH)
  token: string;
}
