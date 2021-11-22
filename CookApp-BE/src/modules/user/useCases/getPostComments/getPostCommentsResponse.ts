import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { Type } from "class-transformer";
import { CommentDTO } from "dtos/comment.dto";

export class GetPostCommentsResponse {
  @ApiResponseProperty({ type: [CommentDTO] })
  @Type(() => CommentDTO)
  comments: CommentDTO[];

  @ApiResponseProperty({ type: PageMetadata })
  @Type(() => PageMetadata)
  metadata: PageMetadata;

  constructor(comments: CommentDTO[], meta: PageMetadata) {
    this.comments = comments;
    this.metadata = meta;
  }
}
