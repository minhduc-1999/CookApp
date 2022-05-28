import { User } from "@sentry/node";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { PostSave } from "domains/social/post.domain";

export interface ISavedPostRepository {
  setTransaction(tx: ITransaction): ISavedPostRepository
  savePost(savedPost: PostSave): Promise<void>
  deleteSavedPost(savedPost: PostSave): Promise<void>
  find(postId: string, userId: string): Promise<PostSave>
  getSavedPosts(user: User, pageOptionDto: PageOptionsDto): Promise<[PostSave[], number]>
}
