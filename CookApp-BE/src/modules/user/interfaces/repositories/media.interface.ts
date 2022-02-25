import { Media } from "domains/social/media.domain";
import { MediaType } from "enums/mediaType.enum";
import { Transaction } from "neo4j-driver";

export interface IMediaRepository {
  setTransaction(tx: Transaction): IMediaRepository
  addMedia(media: Media): Promise<void>
  deleteMedia(object: string): Promise<void>
  deleteMedias(keys: string[]): Promise<void>
  addMedias(keys: string[], type: MediaType): Promise<void>
}
