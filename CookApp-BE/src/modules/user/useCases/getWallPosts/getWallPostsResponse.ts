import { ApiExtraModels, ApiProperty, ApiResponseProperty, getSchemaPath, PickType } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { AlbumResponse, MomentResponse } from "base/dtos/response.dto";
import { Post } from "domains/social/post.domain";

class MomentResponse1 extends PickType(MomentResponse, ["id", "content", "images", "videos", "createdAt", "kind"]) { }

class AlbumResponse1 extends PickType(AlbumResponse, ["id", "name", "images", "videos", "createdAt", "kind"]) { }

type PostResponse = AlbumResponse1 | MomentResponse1

@ApiExtraModels(MomentResponse1, AlbumResponse1)
export class GetWallPostsResponse {
  @ApiProperty({
    type: "array",
    items: {
      oneOf: [
        { $ref: getSchemaPath(AlbumResponse1) },
        { $ref: getSchemaPath(MomentResponse1) }
      ]
    }
  })
  posts: PostResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(posts: Post[], meta: PageMetadata) {
    this.posts = posts.map(post => {
      switch (post.kind) {
        case "Moment":
          return {
            id: post.id,
            images: post.images,
            videos: post.videos,
            createdAt: post.createdAt,
            content: post.content,
            kind: "Moment"
          }
        case "Album":
          return {
            id: post.id,
            images: post.images,
            videos: post.videos,
            createdAt: post.createdAt,
            name: post.name,
            kind: "Album"
          }
      }
    })
    this.metadata = meta;
  }
}
