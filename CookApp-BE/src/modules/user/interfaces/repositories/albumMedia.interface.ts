import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Album } from "domains/social/album.domain";
import { PostMedia } from "domains/social/media.domain";

export interface IAlbumMediaRepository {
  setTransaction(tx: ITransaction): IAlbumMediaRepository
  addMedia(media: PostMedia, album: Album): Promise<PostMedia>
  deleteMedia(media: PostMedia): Promise<void>
  deleteMedias(media: PostMedia[]): Promise<void>
  addMedias(medias: PostMedia[], album: Album): Promise<PostMedia[]>
  getMedia(id: string): Promise<PostMedia>
  getMedias(ids: string[]): Promise<PostMedia[]>
}
