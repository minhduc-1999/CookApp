import { PickType } from "@nestjs/swagger";
import { MediaResponse, PostResponse } from "base/dtos/response.dto";
import { Album, Post } from "domains/social/post.domain";
import { PostType } from "enums/social.enum";

export class CreatePostResponse extends PickType(
  PostResponse, ["id", "createdAt", "content", "videos", "images", "name", "kind", "location"]) {
    constructor(post: Post) {
      super(post)
      this.id = post?.id
      this.kind = post?.kind
      this.createdAt = post?.createdAt?.getTime()
      switch (post.kind) {
        case PostType.ALBUM:
          const album = post as Album
          this.name = album?.name
          this.images = album?.images.map(image => new MediaResponse(image))
          this.videos = album?.videos.map(video => new MediaResponse(video))
          this.location = album?.location
          break;
      case PostType.MOMENT:
          this.content = post?.content
          this.images = post?.images.map(image => new MediaResponse(image))
          this.videos = post?.videos.map(video => new MediaResponse(video))
          this.location = post?.location
          break;
      }
    }
}
