import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PostResponse } from "base/dtos/response.dto";
import { SavedPost } from "domains/social/post.domain";

export class SavedPostDTO {
  @ApiResponseProperty({ type: Number })
  savedAt: number

  @ApiResponseProperty({ type: PostResponse })
  post: PostResponse

  constructor(savedPost: SavedPost) {
    this.savedAt = savedPost.createdAt.getTime()
    this.post = new PostResponse(savedPost.post)
  }
}

export class GetSavedPostsResponse {
  @ApiResponseProperty({ type: [SavedPostDTO] })
  posts: SavedPostDTO[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(posts: SavedPostDTO[], meta: PageMetadata) {
    this.posts = posts;
    this.metadata = meta;
  }
}
