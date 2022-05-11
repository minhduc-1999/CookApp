import { ApiResponseProperty } from "@nestjs/swagger";

export class ChooseInterestsResponse {
  @ApiResponseProperty({ type: [String] })
  wrongTopicIds: string[];

  constructor(wrongTopicIds: string[]) {
    this.wrongTopicIds = wrongTopicIds
  }
}
