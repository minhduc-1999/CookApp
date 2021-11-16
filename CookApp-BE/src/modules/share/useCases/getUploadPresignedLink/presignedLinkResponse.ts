import { ApiResponseProperty } from "@nestjs/swagger";

export class PreSignedLinkResponse {
  @ApiResponseProperty({ type: String })
  objectName: string;

  @ApiResponseProperty({ type: String })
  signedLink: string;
}
