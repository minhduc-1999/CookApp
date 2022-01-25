import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { Type } from "class-transformer";
import { Post } from "domains/social/post.domain";

export class GetWallPostsResponse {
  @ApiResponseProperty({ type: [Post] })
  @Type(() => Post)
  posts: Post[];

  @ApiResponseProperty({ type: PageMetadata })
  @Type(() => PageMetadata)
  metadata: PageMetadata;

  constructor(posts: Post[], meta: PageMetadata) {
    this.posts = posts;
    this.metadata = meta;
  }
}
