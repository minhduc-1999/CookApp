import { ApiResponseProperty } from "@nestjs/swagger";
import { Audit } from "domains/audit.domain";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export class Comment extends Audit {
  @ApiResponseProperty({ type: User })
  user: User;

  @ApiResponseProperty({type: Post})
  target: Post

  @ApiResponseProperty({ type: String })
  content: string;

  @ApiResponseProperty({ type: [Comment] })
  replies?: Comment[];

  @ApiResponseProperty({ type: Comment })
  parent?: Comment;

  @ApiResponseProperty({ type: Number })
  numberOfReply: number

  constructor(comment?: Partial<Comment>) {
    super(comment)
    this.user = comment?.user
    this.target = comment?.target
    this.content = comment?.content
    this.replies = comment?.replies
    this.numberOfReply = comment?.numberOfReply
    this.parent = comment?.parent
  }
}
