import { ApiResponseProperty, PickType } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { classToClass, Exclude, plainToClass, Type } from "class-transformer";
import { UserDTO } from "./user.dto";

export class CommentDTO extends AuditDTO {
  @Type(() => UserDTO)
  @ApiResponseProperty({
    type: PickType(UserDTO, ["id", "displayName", "avatar"]),
  })
  user: Pick<UserDTO, "id" | "displayName" | "avatar">;

  @ApiResponseProperty({ type: String })
  postId: string;

  @ApiResponseProperty({ type: String })
  content: string;

  @Type(() => CommentDTO)
  @ApiResponseProperty({ type: [CommentDTO] })
  replies?: CommentDTO[];

  @Exclude()
  path: string;

  constructor(comment: Partial<CommentDTO>) {
    super(comment);
    this.id = comment?.id;
    this.user = {
      id: comment?.user.id,
      avatar: comment?.user.avatar,
      displayName: comment?.user.displayName,
    };
    this.postId = comment?.postId;
    this.content = comment?.content;
    this.path = comment?.path;
  }

  setParent(parentComment: CommentDTO): CommentDTO {
    if (parentComment) {
      this.path = parentComment.path
        ? `${parentComment.path}${parentComment.id},`
        : `,${parentComment.id},`;
    }
    return this;
  }
}
