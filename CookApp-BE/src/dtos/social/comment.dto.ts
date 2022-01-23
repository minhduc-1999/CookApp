import { ApiResponseProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { UserDTO } from "./user.dto";

export class CommentDTO extends AuditDTO {
  @ApiResponseProperty({ type: UserDTO })
  user: UserDTO;

  @ApiResponseProperty({ type: String })
  postId: string;

  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: [CommentDTO] })
  replies?: CommentDTO[];

  @ApiResponseProperty({ type: String })
  path: string;

  @ApiResponseProperty({ type: Number })
  numberOfReply: number

  constructor(comment?: Partial<CommentDTO>) {
    super(comment)
    this.user = comment?.user
    this.postId = comment?.postId
    this.content = comment?.content
    this.replies = comment?.replies
    this.path = comment?.path
    this.numberOfReply = comment?.numberOfReply
  }

  setParent(parentComment: CommentDTO | string): CommentDTO {
    if (parentComment) {
      if (typeof parentComment === "string") {
        this.path = `,${parentComment},`;
      } else {
        this.path = parentComment.path
          ? `${parentComment.path}${parentComment.id},`
          : `,${parentComment.id},`;
      }
    }
    return this;
  }
}
