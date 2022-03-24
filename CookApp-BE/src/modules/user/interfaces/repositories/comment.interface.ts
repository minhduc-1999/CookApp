import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Comment, CommentTarget } from "domains/social/comment.domain";

export interface ICommentRepository {
  createComment(comment: Comment): Promise<Comment>;
  getCommentById(id: string): Promise<Comment>;
  setTransaction(tx: ITransaction): ICommentRepository
  getReplies(target: CommentTarget, replyOf: string, query: PageOptionsDto): Promise<Comment[]>
  getComments(
    target: CommentTarget,
    query: PageOptionsDto
  ): Promise<Comment[]>;
  getAmountOfReply(parentId: string): Promise<number>;
  getAmountOfComment(target: CommentTarget): Promise<number>;
  getTotalComments(target: CommentTarget): Promise<number>;
  createReply(comment: Comment): Promise<Comment>
}
