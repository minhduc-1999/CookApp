import { ApiResponseProperty } from "@nestjs/swagger";
import { TopicResponse } from "base/dtos/response.dto";
import { Topic } from "domains/social/user.domain";

export class GetInterestedTopicsResponse {
  @ApiResponseProperty({ type: [TopicResponse] })
  topics: TopicResponse[];

  constructor(topics: Topic[]) {
    this.topics = topics?.map((topic) => new TopicResponse(topic));
  }
}
