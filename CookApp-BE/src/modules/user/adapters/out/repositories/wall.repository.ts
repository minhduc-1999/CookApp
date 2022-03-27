import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "base/repository.base";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
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
      .innerJoinAndSelect("post.medias", "media")
      .innerJoinAndSelect("media.interaction", "mediaInter")
      .where("author.id = :authorId", { authorId })
      .select(["post", "interaction", "media", "mediaInter"])
      .skip(query.limit * query.offset)
      .limit(query.limit)
      .getManyAndCount()
    return [entities?.map(entity => entity.toDomain()), total]
  }

  async getWall(userId: string): Promise<User> {
    const entity = await this._userRepo
      .createQueryBuilder("user")
      .where("user.id = :userId", { userId })
      .getOne()
    return entity?.toDomain()
  }

}
