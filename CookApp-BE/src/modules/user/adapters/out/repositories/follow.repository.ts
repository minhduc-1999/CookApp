import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Follow } from "domains/social/follow.domain";
import { User } from "domains/social/user.domain";
import { FollowEntity } from "entities/social/follow.entity";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";
import { QueryRunner, Repository } from "typeorm";

@Injectable()
export class FollowRepository extends BaseRepository implements IFollowRepository {
  constructor(
    @InjectRepository(FollowEntity)
    private _followRepo: Repository<FollowEntity>,
  ) {
    super()
  }
  async createFollower(follow: Follow): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.save<FollowEntity>(new FollowEntity(follow))
    }
  }

  async deleteFollower(follow: Follow): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.softDelete(FollowEntity, follow.id)
    }
  }
  async getFollow(followerId: string, followeeId: string): Promise<Follow> {
    const entity = await this._followRepo
      .createQueryBuilder("follow")
      .where("follow.follower_id = :followerId", { followerId })
      .andWhere("follow.followee_id = :followeeId", { followeeId })
      .getOne()
    return entity?.toDomain()
  }

  async getFollowers(userId: string, query?: PageOptionsDto): Promise<[User[], number]> {
    let entities: FollowEntity[]
    let total: number
    [entities, total] = await this._followRepo.findAndCount({ followee: { id: userId } })
    if (query) {
      [entities, total] = await this._followRepo
        .createQueryBuilder("follow")
        .leftJoinAndSelect("follow.follower", "follower")
        .where("follow.followee_id = :userId", { userId })
        .select(["follow", "follower"])
        .skip(query.limit * query.offset)
        .limit(query.limit)
        .getManyAndCount()
    } else {
      [entities, total] = await this._followRepo
        .createQueryBuilder("follow")
        .leftJoinAndSelect("follow.follower", "follower")
        .where("follow.followee_id = :userId", { userId })
        .select(["follow", "follower"])
        .getManyAndCount()
    }
    return [entities?.map(entity => entity?.follower?.toDomain()), total]
  }

  async getFollowees(userId: string, query?: PageOptionsDto): Promise<[User[], number]> {
    let entities: FollowEntity[]
    let total: number
    if (query) {
      [entities, total] = await this._followRepo
        .createQueryBuilder("follow")
        .leftJoinAndSelect("follow.followee", "followee")
        .where("follow.follower_id = :userId", { userId })
        .select(["follow", "followee"])
        .skip(query.limit * query.offset)
        .limit(query.limit)
        .getManyAndCount()
    } else {
      [entities, total] = await this._followRepo
        .createQueryBuilder("follow")
        .leftJoinAndSelect("follow.followee", "followee")
        .where("follow.follower_id = :userId", { userId })
        .select(["follow", "followee"])
        .getManyAndCount()
    }
    return [entities?.map(entity => entity?.followee?.toDomain()), total]
  }

}
