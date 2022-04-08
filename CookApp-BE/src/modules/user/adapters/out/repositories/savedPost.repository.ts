import { Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { SavedPost } from "domains/social/post.domain";
import { User } from "@sentry/node";
import { PageOptionsDto } from "base/pageOptions.base";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { ISavedPostRepository } from "modules/user/interfaces/repositories/savedPost.interface";
import { SavedPostEntity } from "entities/social/savedPost.entity";

@Injectable()
export class SavedPostRepository extends BaseRepository implements ISavedPostRepository {
  constructor(
    @InjectRepository(SavedPostEntity)
    private _savedPostRepo: Repository<SavedPostEntity>,
  ) {
    super()
  }

  async savePost(savedPost: SavedPost): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.save<SavedPostEntity>(new SavedPostEntity(savedPost))
    }
  }

  async deleteSavedPost(savedPost: SavedPost): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.softDelete(SavedPostEntity, savedPost.id)
    }
  }

  async find(postId: string, userId: string): Promise<SavedPost> {
    const entity = await this._savedPostRepo
      .createQueryBuilder("saved")
      .where("saved.user_id = :userId", { userId })
      .andWhere("saved.post_id = :postId", { postId })
      .select(["saved"])
      .getOne()
    return entity?.toDomain()
  }

  async getSavedPosts(user: User, queryOpt: PageOptionsDto): Promise<[SavedPost[], number]> {
    const [entities, total] = await this._savedPostRepo
      .createQueryBuilder("saved")
      .innerJoin("saved.user", "user")
      .leftJoinAndSelect("saved.post", "post")
      .where("user.id = :userId", { userId: user.id })
      .select(["saved", "post"])
      .skip(queryOpt.limit * queryOpt.offset)
      .take(queryOpt.limit)
      .getManyAndCount()
    return [entities?.map(entity => entity.toDomain()), total]
  }
}
