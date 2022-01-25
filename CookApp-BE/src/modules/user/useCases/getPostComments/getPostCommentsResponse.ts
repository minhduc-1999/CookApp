import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { Type } from "class-transformer";
import { Comment } from "domains/social/comment.domain";

export class GetPostCommentsResponse {
  @ApiResponseProperty({ type: [Comment] })
  @Type(() => Comment)
  comments: Comment[];

  @ApiResponseProperty({ type: PageMetadata })
  @Type(() => PageMetadata)
  metadata: PageMetadata;

  constructor(comments: Comment[], meta: PageMetadata) {
    this.comments = comments;
    this.metadata = meta;
  }
}
