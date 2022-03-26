import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "base/repository.base";
import { Media } from "domains/social/media.domain";
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
  async getMedias(keys: string[]): Promise<Media[]> {
    const entities = await this._postMediaRepo
      .createQueryBuilder("media")
      .innerJoinAndSelect("media.interaction", "interaction")
      .where("media.key IN (:...keys)", { keys })
      .select(["media", "interaction"])
      .getMany()
    return entities.map(entity => entity.toDomain())
  }
  async getMedia(key: string): Promise<Media> {
    const entity = await this._postMediaRepo
      .createQueryBuilder("media")
      .innerJoinAndSelect("media.interaction", "interaction")
      .where("media.key = :key", { key })
      .select(["media", "interaction"])
      .getOne()
    return entity.toDomain()
  }

  async addMedia(media: Media, post: Post): Promise<Media> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const mediaInteraction = await queryRunner.manager.save<InteractionEntity>(new InteractionEntity(media))
      const temp = new PostMediaEntity(media, mediaInteraction)
      temp.post = new PostEntity(post)
      const mediaEntity = await queryRunner.manager.save<PostMediaEntity>(temp)
      return mediaEntity.toDomain()
    }
    return null
  }

  async deleteMedia(media: Media): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.softDelete(InteractionEntity, media.id)
    }
  }

  async deleteMedias(medias: Media[]): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      for (let media of medias) {
        await queryRunner.manager.softDelete(InteractionEntity, media.id)
      }
    }
  }

  async addMedias(medias: Media[], post: Post): Promise<Media[]> {
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
      postEntity.medias = mediaEntities
      return mediaEntities.map(entity => entity.toDomain())
    }
    return null
  }
}
