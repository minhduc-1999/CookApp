import { ApiResponseProperty } from "@nestjs/swagger";

export class GetChatStatusResponse {

  @ApiResponseProperty({ type: Number })
  newMessage: number;

  constructor(notSeen: number) {
    this.newMessage = notSeen
  }
}
