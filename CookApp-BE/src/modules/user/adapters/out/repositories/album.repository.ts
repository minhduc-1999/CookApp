import { Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { IAlbumRepository } from "modules/user/interfaces/repositories/album.interface";
import { Album } from "domains/social/album.domain";
import { AlbumEntity } from "entities/social/album.entity";
import { PageOptionsDto } from "base/pageOptions.base";

@Injectable()
export class AlbumRepository extends BaseRepository implements IAlbumRepository {
  constructor(
    @InjectRepository(AlbumEntity)
    private _albumRepo: Repository<AlbumEntity>,
  ) {
    super()
  }

  async getAlbums(userId: string, queryOpt: PageOptionsDto): Promise<[Album[], number]> {
    const [entities, total] = await this._albumRepo.findAndCount({
      relations: ["medias"],
      where: {
        owner: {
          id: userId
        }
      },
      skip: queryOpt.limit * queryOpt.offset,
      take: queryOpt.limit
    })

    return [entities?.map(entity => entity.toDomain()), total]
  }

  async createAlbum(album: Album): Promise<Album> {
    if (!album) return null
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const albumEntity = await queryRunner.manager.save<AlbumEntity>(new AlbumEntity(album))
      return albumEntity?.toDomain()
    }
    return null
  }

  async getAlbumById(albumId: string): Promise<Album> {
    const albumEntity = await this._albumRepo.findOne(albumId, {
      relations: ["medias", "owner"]
    })
    return albumEntity?.toDomain()
  }

  updateAlbum(album: Album, data: Partial<Album>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
