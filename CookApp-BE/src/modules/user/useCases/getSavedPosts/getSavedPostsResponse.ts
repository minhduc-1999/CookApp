import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { SavedPost } from "domains/social/post.domain";
import { GetPostResponse } from "../getPostById/getPostResponse";

export class SavedPostDTO extends GetPostResponse {
  @ApiResponseProperty({ type: Number})
  savedAt: number
  constructor(post: SavedPost) {
    super(post)
    this.savedAt = post.savedAt
  }
}

export class GetSavedPostsResponse {
  @ApiResponseProperty({ type: [GetPostResponse] })
  posts: SavedPostDTO[];

  metadata: PageMetadata;

  constructor(posts: SavedPostDTO[], meta: PageMetadata) {
    this.posts = posts;
    this.metadata = meta;
  }
}
