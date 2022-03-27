import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Comment } from "domains/social/comment.domain";
import { CommentMedia } from "domains/social/media.domain";

export interface ICommentMediaRepository {
  setTransaction(tx: ITransaction): ICommentMediaRepository
  addMedia(media: CommentMedia, comment: Comment): Promise<CommentMedia>
  deleteMedia(media: CommentMedia): Promise<void>
  deleteMedias(media: CommentMedia[]): Promise<void>
  addMedias(medias: CommentMedia[], comment: Comment): Promise<CommentMedia[]>
  getMedia(id: string): Promise<CommentMedia>
  getMedias(ids: string[]): Promise<CommentMedia[]>
}
