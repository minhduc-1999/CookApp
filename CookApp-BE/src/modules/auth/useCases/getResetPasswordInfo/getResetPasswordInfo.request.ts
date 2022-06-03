import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { RESET_PASSWORD_TOKEN_LENGTH } from "../requestResetPassword";

export class GetResetPasswordInfoRequest {
  @Length(RESET_PASSWORD_TOKEN_LENGTH, RESET_PASSWORD_TOKEN_LENGTH)
  @IsString()
  @ApiProperty({ type: String })
  token: string;
}
