import { Transaction } from "neo4j-driver";
import { PageOptionsDto } from "base/pageOptions.base";
import { CommentDTO } from "dtos/social/comment.dto";

export interface ICommentRepository {
  createComment(comment: CommentDTO): Promise<CommentDTO>;
  getCommentById(id: string): Promise<CommentDTO>;
  setTransaction(tx: Transaction): ICommentRepository
  getReplies(parentID: string, query: PageOptionsDto): Promise<CommentDTO[]>
  getPostComments(
    postId: string,
    query: PageOptionsDto
  ): Promise<CommentDTO[]>;
  getAmountOfReply(parentId: string): Promise<number>;
  getAmountOfComment(postID: string): Promise<number>;
  getTotalPostComments(postID: string): Promise<number>;
  createReply(comment: CommentDTO): Promise<CommentDTO>
}
