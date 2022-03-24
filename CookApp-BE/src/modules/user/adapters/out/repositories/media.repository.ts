import { Inject, Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { Media, MediaBase } from "domains/social/media.domain";
import { Reaction } from "domains/social/reaction.domain";
import { ReactionEntity } from "entities/social/reaction.entity";
import { MediaType } from "enums/social.enum";
import { IMediaRepository } from "modules/user/interfaces/repositories/media.interface";

@Injectable()
export class MediaRepository extends BaseRepository implements IMediaRepository {
  constructor() {
    super()
  }
    addMedia(media: Media): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteMedia(object: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteMedias(keys: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addMedias(keys: string[], type: MediaType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getReacitonByUserID(userID: string, mediaKey: string): Promise<Reaction> {
        throw new Error("Method not implemented.");
    }
    getMedia(key: string): Promise<Media> {
        throw new Error("Method not implemented.");
    }
    reactMedia(reaction: Reaction): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteReaction(reaction: Reaction): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
