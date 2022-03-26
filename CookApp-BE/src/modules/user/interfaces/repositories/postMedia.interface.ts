import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Media } from "domains/social/media.domain";
import { Post } from "domains/social/post.domain";

export interface IPostMediaRepository {
  setTransaction(tx: ITransaction): IPostMediaRepository
  addMedia(media: Media, post: Post): Promise<Media>
  deleteMedia(media: Media): Promise<void>
  deleteMedias(media: Media[]): Promise<void>
  addMedias(medias: Media[], post: Post): Promise<Media[]>
  getMedia(key: string): Promise<Media>
  getMedias(keys: string[]): Promise<Media[]>
}
