import { User } from "@sentry/node";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { SavedPost } from "domains/social/post.domain";

export interface ISavedPostRepository {
  setTransaction(tx: ITransaction): ISavedPostRepository
  savePost(savedPost: SavedPost): Promise<void>
  deleteSavedPost(savedPost: SavedPost): Promise<void>
  find(postId: string, userId: string): Promise<SavedPost>
  getSavedPosts(user: User, pageOptionDto: PageOptionsDto): Promise<[SavedPost[], number]>
}
