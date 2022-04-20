import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { Comment } from "domains/social/comment.domain";

export interface ICommentRepository {
  createComment(comment: Comment): Promise<Comment>;
  getCommentById(id: string): Promise<Comment>;
  setTransaction(tx: ITransaction): ICommentRepository
  getComments(
    target: IInteractable,
    query: PageOptionsDto
  ): Promise<[Comment[], number]>;
  countReply(commentId: string): Promise<number>
  countComments(target: IInteractable): Promise<number>
  getReplies(parent: Comment, queryOpt: PageOptionsDto): Promise<[Comment[], number]>
}
