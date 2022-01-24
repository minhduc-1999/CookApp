import { ApiResponseProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { PostDTO } from "./post.dto";
import { UserDTO } from "./user.dto";

export class CommentDTO extends AuditDTO {
  @ApiResponseProperty({ type: UserDTO })
  user: UserDTO;

  @ApiResponseProperty({type: PostDTO})
  post: PostDTO

  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: [CommentDTO] })
  replies?: CommentDTO[];

  @ApiResponseProperty({ type: CommentDTO })
  parent?: CommentDTO;

  @ApiResponseProperty({ type: Number })
  numberOfReply: number

  constructor(comment?: Partial<CommentDTO>) {
    super(comment)
    this.user = comment?.user
    this.post = comment?.post
    this.content = comment?.content
    this.replies = comment?.replies
    this.numberOfReply = comment?.numberOfReply
    this.parent = comment?.parent
  }
}
