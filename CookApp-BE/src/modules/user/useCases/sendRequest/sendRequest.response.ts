import { ApiResponseProperty } from "@nestjs/swagger";

export class SendRequestResponseDTO {
  @ApiResponseProperty({ type: String })
  requestId: string;

  constructor(requestId: string) {
    this.requestId = requestId;
  }
}
