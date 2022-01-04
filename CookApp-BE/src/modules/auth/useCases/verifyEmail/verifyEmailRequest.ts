import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class VerifyEmailRequest {
  @ApiProperty({ type: String })
  @IsJWT()
  token: string;
}
