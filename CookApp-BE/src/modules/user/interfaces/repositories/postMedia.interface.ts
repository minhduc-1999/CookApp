import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PostMedia } from "domains/social/media.domain";
import { Post } from "domains/social/post.domain";

export interface IPostMediaRepository {
  setTransaction(tx: ITransaction): IPostMediaRepository
  addMedia(media: PostMedia, post: Post): Promise<PostMedia>
  deleteMedia(media: PostMedia): Promise<void>
  deleteMedias(media: PostMedia[]): Promise<void>
  addMedias(medias: PostMedia[], post: Post): Promise<PostMedia[]>
  getMedia(id: string): Promise<PostMedia>
  getMedias(ids: string[]): Promise<PostMedia[]>
}
