import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "base/repository.base";
import { PostMedia } from "domains/social/media.domain";
import { Post } from "domains/social/post.domain";
import { InteractionEntity } from "entities/social/interaction.entity";
import { PostEntity, PostMediaEntity } from "entities/social/post.entity";
import { IPostMediaRepository } from "modules/user/interfaces/repositories/postMedia.interface";
import { QueryRunner, Repository } from "typeorm";

@Injectable()
export class PostMediaRepository extends BaseRepository implements IPostMediaRepository {
  constructor(
    @InjectRepository(PostMediaEntity)
    private _postMediaRepo: Repository<PostMediaEntity>
  ) {
    super()
  }

  async getMedias(ids: string[]): Promise<PostMedia[]> {
    const entities = await this._postMediaRepo
      .createQueryBuilder("media")
      .leftJoinAndSelect("media.interaction", "interaction")
      .where("media.id IN (:...ids)", { ids })
      .select(["media", "interaction"])
      .getMany()
    return entities?.map(entity => entity.toDomain())
  }

  async getMedia(id: string): Promise<PostMedia> {
    const entity = await this._postMediaRepo
      .createQueryBuilder("media")
      .leftJoinAndSelect("media.interaction", "interaction")
      .where("media.id = :id", { id })
      .select(["media", "interaction"])
      .getOne()
    return entity?.toDomain()
  }

  async addMedia(media: PostMedia, post: Post): Promise<PostMedia> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const mediaInteraction = await queryRunner.manager.save<InteractionEntity>(new InteractionEntity(media))
      const temp = new PostMediaEntity(media, mediaInteraction)
      temp.post = new PostEntity(post)
      const mediaEntity = await queryRunner.manager.save<PostMediaEntity>(temp)
      return mediaEntity?.toDomain()
    }
    return null
  }

  async deleteMedia(media: PostMedia): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.softDelete(InteractionEntity, media.id)
    }
  }

  async deleteMedias(medias: PostMedia[]): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      for (let media of medias) {
        await queryRunner.manager.softDelete(InteractionEntity, media.id)
      }
    }
  }

  async addMedias(medias: PostMedia[], post: Post): Promise<PostMedia[]> {
    if (!post) return null
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const mediaEntities: PostMediaEntity[] = []
      const postEntity = new PostEntity(post)
      for (let media of medias) {
        const mediaInteraction = await queryRunner.manager.save<InteractionEntity>(new InteractionEntity(media))
        const temp = new PostMediaEntity(media, mediaInteraction)
        temp.post = postEntity
        const mediaEntity = await queryRunner.manager.save<PostMediaEntity>(temp)
        mediaEntities.push(mediaEntity)
      }
      return mediaEntities?.map(entity => entity.toDomain())
    }
    return null
  }
}
