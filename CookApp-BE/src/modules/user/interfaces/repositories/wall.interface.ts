import { PageOptionsDto } from "base/pageOptions.base";
import { PostDTO } from "dtos/social/post.dto";
import { WallDTO } from "dtos/social/wall.dto";
import { Transaction } from "neo4j-driver";

export interface IWallRepository {
  getPosts(userId: string, query: PageOptionsDto): Promise<PostDTO[]>;
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
  getWall(userId: string): Promise<WallDTO>;
}
