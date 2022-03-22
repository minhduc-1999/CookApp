import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PostResponse } from "base/dtos/response.dto";

export class GetFeedPostsResponse {
  @ApiResponseProperty({ type: [PostResponse] })
  posts: PostResponse[];

  metadata: PageMetadata;

  constructor(posts: PostResponse[], meta: PageMetadata) {
    this.posts = posts;
    this.metadata = meta;
  }
}
