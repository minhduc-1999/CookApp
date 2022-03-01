import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { GetPostResponse } from "../getPostById/getPostResponse";

export class GetSavedPostsResponse {
  @ApiResponseProperty({ type: [GetPostResponse] })
  posts: GetPostResponse[];

  metadata: PageMetadata;

  constructor(posts: GetPostResponse[], meta: PageMetadata) {
    this.posts = posts;
    this.metadata = meta;
  }
}
