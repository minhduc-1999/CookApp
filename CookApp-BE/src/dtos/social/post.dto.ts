import { ApiResponseProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { UserDTO } from "./user.dto";

export class PostDTO extends AuditDTO {
  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: [String] })
  images?: string[];

  @ApiResponseProperty({ type: [String] })
  videos?: string[];

  @ApiResponseProperty({ type: UserDTO })
  author: UserDTO

  @ApiResponseProperty({ type: Number })
  numOfReaction: number;

  @ApiResponseProperty({ type: Number })
  numOfComment: number;

  constructor(post: Partial<PostDTO>) {
    super(post)
    this.content = post?.content
    this.images = post?.images
    this.videos = post?.videos
    this.author = post?.author
    this.numOfComment = post?.numOfComment
    this.numOfReaction = post?.numOfReaction
  }
}
