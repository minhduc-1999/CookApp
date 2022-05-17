import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { TopicResponse } from "base/dtos/response.dto";
import { Topic } from "domains/social/user.domain";

export class GetTopicsResponse {
  @ApiResponseProperty({ type: [TopicResponse] })
  topics: TopicResponse[];

  metadata: PageMetadata;

  constructor(topics: Topic[], meta: PageMetadata) {
    this.topics = topics?.map(topic => new TopicResponse(topic));
    this.metadata = meta;
  }
}
