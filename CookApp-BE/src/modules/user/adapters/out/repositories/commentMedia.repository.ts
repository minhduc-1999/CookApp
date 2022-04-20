import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "base/repository.base";
import { Comment } from "domains/social/comment.domain";
import { CommentMedia } from "domains/social/media.domain";
import { CommentEntity, CommentMediaEntity } from "entities/social/comment.entity";
import { ICommentMediaRepository } from "modules/user/interfaces/repositories/commentMedia.interface";
import { QueryRunner, Repository } from "typeorm";

@Injectable()
export class CommentMediaRepository extends BaseRepository implements ICommentMediaRepository {
  constructor(
    @InjectRepository(CommentMediaEntity)
    private _commentMediaRepo: Repository<CommentMediaEntity>
  ) {
    super()
  }

  async getMedias(ids: string[]): Promise<CommentMedia[]> {
    const entities = await this._commentMediaRepo
      .createQueryBuilder("media")
      .where("media.id IN (:...ids)", { ids })
      .select(["media"])
      .getMany()
    return entities?.map(entity => entity.toDomain())
  }

  async getMedia(id: string): Promise<CommentMedia> {
    const entity = await this._commentMediaRepo
      .createQueryBuilder("media")
      .where("media.id = :id", { id })
      .select(["media" ])
      .getOne()
    return entity?.toDomain()
  }

  async addMedia(media: CommentMedia, comment: Comment): Promise<CommentMedia> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const temp = new CommentMediaEntity(media ,comment)
      const mediaEntity = await queryRunner.manager.save<CommentMediaEntity>(temp)
      return mediaEntity?.toDomain()
    }
    return null
  }

  async deleteMedia(media: CommentMedia): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.softDelete(CommentMediaEntity, media.id)
    }
  }

  async deleteMedias(medias: CommentMedia[]): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      for (let media of medias) {
        await queryRunner.manager.softDelete(CommentMediaEntity, media.id)
      }
    }
  }

  async addMedias(medias: CommentMedia[], comment: Comment): Promise<CommentMedia[]> {
    if (!comment) return null
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const mediaEntities: CommentMediaEntity[] = []
      for (let media of medias) {
        const temp = new CommentMediaEntity(media, comment)
        const mediaEntity = await queryRunner.manager.save<CommentMediaEntity>(temp)
        mediaEntities.push(mediaEntity)
      }
      return mediaEntities?.map(entity => entity.toDomain())
    }
    return null
  }
}
