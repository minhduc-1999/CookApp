import { Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { Post } from "domains/social/post.domain";
import { Wall } from "domains/social/wall.domain";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";
import { GetWallPostsRequest } from "modules/user/useCases/getWallPosts/getWallPostsRequest";

@Injectable()
export class WallRepository extends BaseRepository implements IWallRepository {
  constructor() {
    super()
  }
  getPosts(userId: string, query: GetWallPostsRequest): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
  getTotalPosts(userId: string, query: GetWallPostsRequest): Promise<number> {
    throw new Error("Method not implemented.");
  }
  createFollower(userId: string, targetId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteFollower(userId: string, targetId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  isFollowed(sourceId: string, targetId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getFollowers(userId: string): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  getFollowing(userId: string): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  getWall(userId: string): Promise<Wall> {
    throw new Error("Method not implemented.");
  }

}
