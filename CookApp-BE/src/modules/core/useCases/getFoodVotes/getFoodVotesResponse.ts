import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { FoodVoteResponse } from "base/dtos/response.dto";
import { FoodVote } from "domains/core/foodVote.domain";

export class GetFoodVotesResponse {
  @ApiResponseProperty({ type: [FoodVoteResponse] })
  votes: FoodVoteResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(votes: FoodVote[], meta: PageMetadata) {
    this.votes = votes.map((vote) => new FoodVoteResponse(vote));
    this.metadata = meta;
  }
}
