import { Audit } from "domains/audit.domain";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { Post } from "./post.domain";
import { User } from "./user.domain";

export type CommentTarget = Post | RecipeStep
export class Comment extends Audit {
  user: User;

  target: CommentTarget

  content: string;

  replies?: Comment[];

  parent?: Comment;

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
