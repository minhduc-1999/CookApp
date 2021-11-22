import { ApiResponseProperty } from "@nestjs/swagger";

export class ReactPostResponse {
  @ApiResponseProperty({ type: Boolean })
  reacted: boolean;

  constructor(reacted: boolean) {
    this.reacted = reacted;
  }
}
