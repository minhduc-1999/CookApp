import { User } from "@sentry/node";
import { PageOptionsDto } from "base/pageOptions.base";
import { Post } from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { Transaction } from "neo4j-driver";

export interface IPostRepository {
  createPost(post: Post): Promise<Post>;
  getPostById(postId: string): Promise<Post>;
  getPostByIds(postId: string[]): Promise<Post[]>;
  updatePost(post: Partial<Post>, editPostDto: EditPostRequest): Promise<void>;
  reactPost(reaction: Reaction): Promise<boolean>;
  deleteReact(reaction: Reaction): Promise<boolean>;
  getReactionByUserId(userId: string, postId: string): Promise<Reaction>;
  setTransaction(tx: Transaction): IPostRepository
  isExisted(postID: string): Promise<boolean>
  savePost(postID: string, user: User): Promise<void>
  deleteSavedPost(postID: string, user: User): Promise<void>
  isSavedPost(postID: string, user: User): Promise<boolean>
  getSavedPosts(user: User, pageOptionDto: PageOptionsDto): Promise<Post[]>
  getTotalSavedPost(user: User): Promise<number>
}
