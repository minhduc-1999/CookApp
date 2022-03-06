import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { CommentResponse } from "base/dtos/response.dto";
import { Comment } from "domains/social/comment.domain";

export class GetCommentsResponse {
  @ApiResponseProperty({ type: [CommentResponse] })
  comments: CommentResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(comments: Comment[], meta: PageMetadata) {
    this.comments = comments.map(comment => new CommentResponse(comment));
    this.metadata = meta;
  }
}
