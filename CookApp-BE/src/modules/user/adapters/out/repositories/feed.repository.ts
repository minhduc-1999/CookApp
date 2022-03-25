import { Injectable } from "@nestjs/common";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { FeedEntity } from "entities/social/feed.entity";
import { QueryRunner, Repository } from "typeorm";

@Injectable()
export class FeedRepository extends BaseRepository implements IFeedRepository {
  constructor(
    @InjectRepository(FeedEntity)
    private _feedRepo: Repository<FeedEntity>
  ) {
    super()
  }

  async pushNewPost(post: Post, users: User[]): Promise<void> {
    const queryRunner = this.tx?.getRef() as QueryRunner
    const entities = users.map(user => new FeedEntity(user, post))
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.save<FeedEntity>(entities)
    } else {
      await this._feedRepo.save(entities)
    }
  }

  async getPosts(user: User, query: PageOptionsDto): Promise<[Post[], number]> {
    const [entities, total] = await this._feedRepo
      .createQueryBuilder("feed")
      .innerJoinAndSelect("feed.post", "post")
      .innerJoinAndSelect("post.author", "author")
      .innerJoinAndSelect("post.interaction", "interaction")
      .where("feed.user_id = :userId", { userId: user.id })
      .select(["feed", "post", "interaction", "author.id", "author.displayName", "author.avatar"])
      .skip(query.limit * query.offset)
      .limit(query.limit)
      .getManyAndCount()
    return [entities.map(entity => entity.toDomain()), total]
  }
}
