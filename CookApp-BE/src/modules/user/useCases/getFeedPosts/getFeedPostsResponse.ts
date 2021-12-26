import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { GetPostResponse } from "../getPostById/getPostResponse";

export class GetFeedPostsResponse {
  posts: GetPostResponse[];

  metadata: PageMetadata;

  constructor(posts: GetPostResponse[], meta: PageMetadata) {
    this.posts = posts;
    this.metadata = meta;
  }
}
