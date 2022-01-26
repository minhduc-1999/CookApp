import { Post } from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { Transaction } from "neo4j-driver";

export interface IPostRepository {
  createPost(post: Post): Promise<Post>;
  getPostById(postId: string): Promise<Post>;
  getPostByIds(postId: string[]): Promise<Post[]>;
  updatePost(post: Partial<Post>): Promise<Post>;
  reactPost(reaction: Reaction): Promise<boolean>;
  deleteReact(reaction: Reaction): Promise<boolean>;
  getReactionByUserId(userId: string, postId: string): Promise<Reaction>;
  setTransaction(tx: Transaction): IPostRepository
}
