import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";

export interface IFeedRepository {
  pushNewPost(post: Post, userId: string[]): Promise<void>;
  getPosts(user: User, query: PageOptionsDto): Promise<Post[]>;
  getTotalPosts(userId: User): Promise<number>;
  setTransaction(tx: ITransaction): IFeedRepository
}
