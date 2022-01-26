import { ApiResponseProperty, PickType } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { Post } from "domains/social/post.domain";

class PostResponse extends PickType(Post, ["id", "content", "images", "videos", "createdAt"]) { }
export class GetWallPostsResponse {
  @ApiResponseProperty({ type: [PostResponse] })
  posts: PostResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(posts: Post[], meta: PageMetadata) {
    this.posts = posts.map(post => {
      return {
        id: post.id,
        images: post.images,
        videos: post.videos,
        createdAt: post.createdAt,
        content: post.content
      }
    })
    this.metadata = meta;
  }
}
