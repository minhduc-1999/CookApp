import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Album } from "domains/social/album.domain";

export interface IAlbumRepository {
  createAlbum(album: Album): Promise<Album>;
  getAlbumById(albumId: string): Promise<Album>;
  updateAlbum(album: Album, data: Partial<Album>): Promise<void>;
  setTransaction(tx: ITransaction): IAlbumRepository
  getAlbums(userId: string, queryOpt: PageOptionsDto): Promise<[Album[], number]>
}
