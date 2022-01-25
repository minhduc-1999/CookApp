import { PageOptionsDto } from "base/pageOptions.base";
import { Post } from "domains/social/post.domain";
import { Wall } from "domains/social/wall.domain";
import { Transaction } from "neo4j-driver";

export interface IWallRepository {
  getPosts(userId: string, query: PageOptionsDto): Promise<Post[]>;
  getTotalPosts(userId: string): Promise<number>;
  setTransaction(tx: Transaction): IWallRepository
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
