import { ApiResponseProperty } from "@nestjs/swagger";

export class GoogleSignInResponse {
  @ApiResponseProperty({ type: String })
  accessToken: string;

  @ApiResponseProperty({ type: String })
  userId: string;
}
