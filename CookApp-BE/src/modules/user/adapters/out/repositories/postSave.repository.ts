import { Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { PostSave } from "domains/social/post.domain";
import { User } from "@sentry/node";
import { PageOptionsDto } from "base/pageOptions.base";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { ISavedPostRepository } from "modules/user/interfaces/repositories/savedPost.interface";
import { PostSaveEntity } from "entities/social/PostSave.entity";

@Injectable()
export class SavedPostRepository extends BaseRepository implements ISavedPostRepository {
  constructor(
    @InjectRepository(PostSaveEntity)
    private _savedPostRepo: Repository<PostSaveEntity>,
  ) {
    super()
  }

  async savePost(savedPost: PostSave): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.save<PostSaveEntity>(new PostSaveEntity(savedPost))
    }
  }

  async deleteSavedPost(savedPost: PostSave): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.softDelete(PostSaveEntity, savedPost.id)
    }
  }

  async find(postId: string, userId: string): Promise<PostSave> {
    const entity = await this._savedPostRepo
      .createQueryBuilder("saved")
      .where("saved.user_id = :userId", { userId })
      .andWhere("saved.post_id = :postId", { postId })
      .select(["saved"])
      .getOne()
    return entity?.toDomain()
  }

  async getSavedPosts(user: User, queryOpt: PageOptionsDto): Promise<[PostSave[], number]> {
    const [entities, total] = await this._savedPostRepo
      .createQueryBuilder("saved")
      .innerJoin("saved.user", "user")
      .leftJoinAndSelect("saved.post", "post")
      .leftJoinAndSelect("post.medias", "media")
      .leftJoinAndSelect("post.interaction", "interaction")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("post.foodRef", "foodRef")
      .leftJoinAndSelect("foodRef.medias", "foodMedias")
      .where("user.id = :userId", { userId: user.id })
      .skip(queryOpt.limit * queryOpt.offset)
      .take(queryOpt.limit)
      .getManyAndCount()
    return [entities?.map(entity => entity.toDomain()), total]
  }
}
