import { Transaction } from "neo4j-driver";
import { PageOptionsDto } from "base/pageOptions.base";
import { Comment } from "domains/social/comment.domain";

export interface ICommentRepository {
  createComment(comment: Comment): Promise<Comment>;
  getCommentById(id: string): Promise<Comment>;
  setTransaction(tx: Transaction): ICommentRepository
  getReplies(parentID: string, query: PageOptionsDto): Promise<Comment[]>
  getPostComments(
    postId: string,
    query: PageOptionsDto
  ): Promise<Comment[]>;
  getAmountOfReply(parentId: string): Promise<number>;
  getAmountOfComment(postID: string): Promise<number>;
  getTotalPostComments(postID: string): Promise<number>;
  createReply(comment: Comment): Promise<Comment>
}
