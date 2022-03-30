import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "base/repository.base";
import { Album } from "domains/social/album.domain";
import { PostMedia } from "domains/social/media.domain";
import { AlbumEntity, AlbumMediaEntity } from "entities/social/album.entity";
import { InteractionEntity } from "entities/social/interaction.entity";
import { IAlbumMediaRepository } from "modules/user/interfaces/repositories/albumMedia.interface";
import { QueryRunner, Repository } from "typeorm";

@Injectable()
export class AlbumMediaRepository extends BaseRepository implements IAlbumMediaRepository{
  constructor(
    @InjectRepository(AlbumMediaEntity)
    private _postMediaRepo: Repository<AlbumMediaEntity>
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

  async addMedia(media: PostMedia, album: Album): Promise<PostMedia> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const mediaInteraction = await queryRunner.manager.save<InteractionEntity>(new InteractionEntity(media))
      const temp = new AlbumMediaEntity(media, mediaInteraction)
      temp.album = new AlbumEntity(album)
      const mediaEntity = await queryRunner.manager.save<AlbumMediaEntity>(temp)
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

  async addMedias(medias: PostMedia[], album: Album): Promise<PostMedia[]> {
    if (!album) return null
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const mediaEntities: AlbumMediaEntity[] = []
      const postEntity = new AlbumEntity(album)
      for (let media of medias) {
        const mediaInteraction = await queryRunner.manager.save<InteractionEntity>(new InteractionEntity(media))
        const temp = new AlbumMediaEntity(media, mediaInteraction)
        temp.album = postEntity
        const mediaEntity = await queryRunner.manager.save<AlbumMediaEntity>(temp)
        mediaEntities.push(mediaEntity)
      }
      return mediaEntities?.map(entity => entity.toDomain())
    }
    return null
  }
}
