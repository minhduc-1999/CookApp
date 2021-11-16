import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PostDTO } from "dtos/post.dto";

export class GetFeedPostsResponse {
  @ApiResponseProperty({ type: [PostDTO] })
  posts: PostDTO[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(posts: PostDTO[], meta: PageMetadata) {
    this.posts = posts;
    this.metadata = meta;
  }
}
