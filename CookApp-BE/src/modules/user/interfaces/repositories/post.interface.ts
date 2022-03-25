import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Post } from "domains/social/post.domain";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";

export interface IPostRepository {
  createPost(post: Post): Promise<Post>;
  getPostById(postId: string): Promise<Post>;
  getPostByIds(postId: string[]): Promise<Post[]>;
  updatePost(post: Post, editPostDto: EditPostRequest): Promise<void>;
  setTransaction(tx: ITransaction): IPostRepository
}
