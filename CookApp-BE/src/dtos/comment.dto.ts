import { ApiResponseProperty, PickType } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { UserDTO } from "./user.dto";

export class CommentDTO extends AuditDTO {
  @Type(() => UserDTO)
  @ApiResponseProperty({
    type: PickType(UserDTO, ["id", "displayName", "avatar"]),
  })
  @Expose()
  user: UserDTO;

  @Expose()
  @ApiResponseProperty({ type: String })
  postId: string;

  @Expose()
  @ApiResponseProperty({ type: String })
  content: string;

  @Expose()
  @Type(() => CommentDTO)
  @ApiResponseProperty({ type: [CommentDTO] })
  replies?: CommentDTO[];

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  path: string;

  static create(
    comment: Pick<CommentDTO, "user" | "postId" | "content" | "replies">
  ): CommentDTO {
    const createdComment = new CommentDTO();
    createdComment.create(comment?.user.id);
    createdComment.content = comment?.content;
    createdComment.postId = comment?.postId;
    createdComment.replies = comment?.replies;
    createdComment.user = comment?.user;
    return createdComment;
  }

  setParent(parentComment: CommentDTO | string): CommentDTO {
    console.log(parentComment);
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
