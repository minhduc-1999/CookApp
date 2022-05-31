import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class RequestResetPasswordRequest {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;
}
