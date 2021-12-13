import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { Type } from "class-transformer";
import { PostDTO } from "dtos/social/post.dto";

export class GetFeedPostsResponse {
  @ApiResponseProperty({ type: () => [PostDTO] })
  @Type(() => PostDTO)
  posts: PostDTO[];

  @ApiResponseProperty({ type: PageMetadata })
  @Type(() => PageMetadata)
  metadata: PageMetadata;

  constructor(posts: PostDTO[], meta: PageMetadata) {
    this.posts = posts;
    this.metadata = meta;
  }
}
