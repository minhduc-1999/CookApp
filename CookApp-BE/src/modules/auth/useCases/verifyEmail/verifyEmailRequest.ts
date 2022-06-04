import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, Length } from "class-validator";
import { EMAIL_VERIFICATION_CODE_LENGTH } from "modules/auth/constants";

export class VerifyEmailRequest {
  @ApiProperty({ type: String })
  @IsNumberString()
  @Length(EMAIL_VERIFICATION_CODE_LENGTH, EMAIL_VERIFICATION_CODE_LENGTH)
  code: string;
}
