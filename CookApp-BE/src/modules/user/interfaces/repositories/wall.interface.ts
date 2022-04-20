import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { GetWallPostsRequest } from "modules/user/useCases/getWallPosts/getWallPostsRequest";

export interface IWallRepository {
  getPosts(userId: string, query: GetWallPostsRequest): Promise<[Post[], number]>;
  setTransaction(tx: ITransaction): IWallRepository
  getWall(userId: string): Promise<User>;
}
