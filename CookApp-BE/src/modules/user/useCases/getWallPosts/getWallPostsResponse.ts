import { ApiExtraModels, ApiProperty, ApiResponseProperty, getSchemaPath, PickType } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { AlbumResponse, MediaResponse, MomentResponse } from "base/dtos/response.dto";
import { Album, Post } from "domains/social/post.domain";
import { PostType } from "enums/social.enum";

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
      switch (post.type) {
        case PostType.MOMENT:
          return {
            id: post.id,
            images: post.images.map(image => new MediaResponse(image)),
            videos: post.videos.map(video => new MediaResponse(video)),
            createdAt: post.createdAt.getTime(),
            content: post.content,
            kind: "Moment"
          }
        case PostType.ALBUM:
          const album = post as Album
          return {
            id: album.id,
            images: album.images.map(image => new MediaResponse(image)),
            videos: album.videos.map(video => new MediaResponse(video)),
            createdAt: album.createdAt.getTime(),
            name: album.name,
            kind: "Album"
          }
      }
    })
    this.metadata = meta;
  }
}
