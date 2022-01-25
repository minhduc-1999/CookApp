import { PostDTO } from "dtos/social/post.dto";
import { ReactionDTO } from "dtos/social/reaction.dto";
import { Transaction } from "neo4j-driver";

export interface IPostRepository {
  createPost(post: PostDTO): Promise<PostDTO>;
  getPostById(postId: string): Promise<PostDTO>;
  getPostByIds(postId: string[]): Promise<PostDTO[]>;
  updatePost(post: Partial<PostDTO>): Promise<PostDTO>;
  reactPost(reaction: ReactionDTO): Promise<boolean>;
  deleteReact(reaction: ReactionDTO): Promise<boolean>;
  getReactionByUserId(userId: string, postId: string): Promise<ReactionDTO>;
  setTransaction(tx: Transaction): IPostRepository
}
