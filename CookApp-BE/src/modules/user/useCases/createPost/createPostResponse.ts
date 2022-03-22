import { PickType } from "@nestjs/swagger";
import { MediaResponse, PostResponse } from "base/dtos/response.dto";
import { Post } from "domains/social/post.domain";

export class CreatePostResponse extends PickType(
  PostResponse, ["id", "createdAt", "content", "videos", "images", "name", "kind"]) {
    constructor(post: Post) {
      super(post)
      this.id = post?.id
      this.kind = post?.kind
      this.createdAt = post?.createdAt
      switch (post.kind) {
        case "Album":
          this.name = post?.name
          this.images = post?.images.map(image => new MediaResponse(image))
          this.videos = post?.videos.map(video => new MediaResponse(video))

          break;
      case "Moment":
          this.content = post?.content
          this.images = post?.images.map(image => new MediaResponse(image))

          this.videos = post?.videos.map(video => new MediaResponse(video))

          break;
      }
    }
}
