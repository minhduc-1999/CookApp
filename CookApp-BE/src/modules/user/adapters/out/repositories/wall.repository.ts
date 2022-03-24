import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "base/repository.base";
import { Post } from "domains/social/post.domain";
import { Wall } from "domains/social/wall.domain";
import { PostEntity } from "entities/social/post.entity";
import { UserEntity } from "entities/social/user.entity";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";
import { GetWallPostsRequest } from "modules/user/useCases/getWallPosts/getWallPostsRequest";
import { Repository } from "typeorm";

@Injectable()
export class WallRepository extends BaseRepository implements IWallRepository {
  constructor(
    @InjectRepository(PostEntity)
    private _postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private _userRepo: Repository<UserEntity>,
  ) {
    super()
  }
  async getPosts(authorId: string, query: GetWallPostsRequest): Promise<[Post[], number]> {
    const [entities, total] = await this._postRepo
      .createQueryBuilder("post")
      .innerJoinAndSelect("post.interaction", "interaction")
      .innerJoinAndSelect("post.author", "author")
      .where("author.id = :authorId", { authorId })
      .skip(query.limit * query.offset)
      .limit(query.limit)
      .getManyAndCount()
    return [entities.map(entity => entity.toDomain()), total]
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
