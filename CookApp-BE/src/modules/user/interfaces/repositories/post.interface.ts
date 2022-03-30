import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Post } from "domains/social/post.domain";

export interface IPostRepository {
  createPost(post: Post): Promise<Post>;
  getPostById(postId: string): Promise<Post>;
  getPostByIds(postId: string[]): Promise<Post[]>;
  updatePost(post: Post, data: Partial<Post>): Promise<void>;
  setTransaction(tx: ITransaction): IPostRepository
}
