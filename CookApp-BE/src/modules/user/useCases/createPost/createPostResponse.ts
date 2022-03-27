import { PickType } from "@nestjs/swagger";
import { MediaResponse, PostResponse } from "base/dtos/response.dto";
import { Album, Post } from "domains/social/post.domain";
import { PostType } from "enums/social.enum";

export class CreatePostResponse extends PickType(
  PostResponse, ["id", "createdAt", "content", "medias", "name", "kind", "location"]) {
    constructor(post: Post) {
      super(post)
      this.id = post?.id
      this.kind = post?.type
      this.createdAt = post?.createdAt?.getTime()
      switch (post.type) {
        case PostType.ALBUM:
          const album = post as Album
          this.name = album?.name
          this.medias = album?.medias.map(image => new MediaResponse(image))
          this.location = album?.location
          break;
      case PostType.MOMENT:
          this.content = post?.content
          this.medias = post?.medias.map(image => new MediaResponse(image))
          this.location = post?.location
          break;
      }
    }
}
