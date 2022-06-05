import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Post } from "domains/social/post.domain";

export interface IPostRepository {
  createPost(post: Post): Promise<Post>;
  getPostById(postId: string): Promise<Post>;
  getPostByIds(postId: string[]): Promise<Post[]>;
  updatePost(post: Post, data: Partial<Post>): Promise<void>;
  setTransaction(tx: ITransaction): IPostRepository
  getPostsByTag(tag: string, query: PageOptionsDto): Promise<[Post[], number]>
}
