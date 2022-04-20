import { ApiExtraModels, ApiProperty, ApiResponseProperty, getSchemaPath, PickType } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { MediaResponse, MomentResponse } from "base/dtos/response.dto";
import { Post } from "domains/social/post.domain";
import { PostType } from "enums/social.enum";

class MomentResponse1 extends PickType(MomentResponse, ["id", "content", "medias", "createdAt", "kind"]) { }

type PostResponse = MomentResponse1

@ApiExtraModels(MomentResponse1 )
export class GetWallPostsResponse {
  @ApiProperty({
    type: "array",
    items: {
      oneOf: [
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
            medias: post.medias.map(image => new MediaResponse(image)),
            createdAt: post.createdAt?.getTime(),
            content: post.content,
            kind: "Moment"
          }
      }
    })
    this.metadata = meta;
  }
}
