import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Media } from "domains/social/media.domain";
import { Reaction } from "domains/social/reaction.domain";
import { MediaType } from "enums/social.enum";

export interface IMediaRepository {
  setTransaction(tx: ITransaction): IMediaRepository
  addMedia(media: Media): Promise<void>
  deleteMedia(object: string): Promise<void>
  deleteMedias(keys: string[]): Promise<void>
  addMedias(keys: string[], type: MediaType): Promise<void>
  getReacitonByUserID(userID: string, mediaKey: string): Promise<Reaction>
  getMedia(key: string): Promise<Media>
  reactMedia(reaction: Reaction): Promise<void>
  deleteReaction(reaction: Reaction): Promise<void>
}
