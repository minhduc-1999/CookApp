import { ApiResponseProperty } from "@nestjs/swagger";

export class ReactResponse {
  @ApiResponseProperty({ type: Boolean })
  reacted: boolean;

  constructor(reacted: boolean) {
    this.reacted = reacted;
  }
}
