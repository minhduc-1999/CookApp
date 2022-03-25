import { User } from "@sentry/node";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Post, SavedPost } from "domains/social/post.domain";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";

export interface IPostRepository {
  createPost(post: Post): Promise<Post>;
  getPostById(postId: string): Promise<Post>;
  getPostByIds(postId: string[]): Promise<Post[]>;
  updatePost(post: Post, editPostDto: EditPostRequest): Promise<void>;
  setTransaction(tx: ITransaction): IPostRepository
  isExisted(postID: string): Promise<boolean>
  savePost(savedPost: SavedPost): Promise<void>
  deleteSavedPost(postID: string, user: User): Promise<void>
  isSavedPost(postID: string, user: User): Promise<boolean>
  getSavedPosts(user: User, pageOptionDto: PageOptionsDto): Promise<SavedPost[]>
  getTotalSavedPost(user: User): Promise<number>
}
