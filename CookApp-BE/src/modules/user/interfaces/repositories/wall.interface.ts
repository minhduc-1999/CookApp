import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Post } from "domains/social/post.domain";
import { Wall } from "domains/social/wall.domain";
import { GetWallPostsRequest } from "modules/user/useCases/getWallPosts/getWallPostsRequest";

export interface IWallRepository {
  getPosts(userId: string, query: GetWallPostsRequest): Promise<Post[]>;
  getTotalPosts(userId: string, query: GetWallPostsRequest): Promise<number>;
  setTransaction(tx: ITransaction): IWallRepository
  createFollower(
    userId: string,
    targetId: string,
  ): Promise<void>;
  deleteFollower(
    userId: string,
    targetId: string,
  ): Promise<void>;
  isFollowed(sourceId: string, targetId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<string[]>;
  getFollowing(userId: string): Promise<string[]>;
  getWall(userId: string): Promise<Wall>;
}
