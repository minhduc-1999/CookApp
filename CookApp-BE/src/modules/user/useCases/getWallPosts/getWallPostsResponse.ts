import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PostResponse } from "base/dtos/response.dto";
import { Post } from "domains/social/post.domain";

export class GetWallPostsResponse {
  @ApiProperty({
    type: [PostResponse],
  })
  posts: PostResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(posts: Post[], meta: PageMetadata) {
    this.posts = posts.map((post) => new PostResponse(post));
    this.metadata = meta;
  }
}
