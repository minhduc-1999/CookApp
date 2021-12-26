import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class GoogleSignInRequest {
  @ApiProperty({ type: String })
  @IsJWT()
  idToken: string;
}
