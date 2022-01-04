import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ResendEmailVerificationRequest {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;
}
