import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ResponseDTO } from "base/dtos/response.dto";
import { Album } from "domains/social/album.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IAlbumRepository } from "../interfaces/repositories/album.interface";
import { IAlbumMediaRepository } from "../interfaces/repositories/albumMedia.interface";

export interface IAlbumService {
  getAlbumDetail(albumId: string): Promise<Album>;
  createAlbum(post: Album, tx: ITransaction): Promise<Album>
}

@Injectable()
export class AlbumService implements IAlbumService {
  constructor(
    @Inject("IAlbumRepository") private _albumRepo: IAlbumRepository,
    @Inject("IAlbumMediaRepository") private _albumMediaRepo: IAlbumMediaRepository,
    @Inject("IStorageService") private _storageService: IStorageService,
  ) { }
  async getAlbumDetail(albumId: string): Promise<Album> {
    const album = await this._albumRepo.getAlbumById(albumId);

    if (!album)
      throw new NotFoundException(
        ResponseDTO.fail("Album not found", UserErrorCode.ALBUM_NOT_FOUND)
      );
    return album
  }

  async createAlbum(album: Album, tx: ITransaction): Promise<Album> {
    const albumResult = await this._albumRepo.setTransaction(tx).createAlbum(album)
    if (album.medias.length > 0) {
      let medias = await this._albumMediaRepo.setTransaction(tx).addMedias(album.medias, albumResult)
      if (medias.length > 0) {
        medias = await this._storageService.getDownloadUrls(medias)
        albumResult.medias = medias
      }
    }
    return albumResult
  }
}
