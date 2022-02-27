import { Inject, Injectable } from "@nestjs/common";
import { Media } from "domains/social/media.domain";
import { Post } from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { Transaction } from "neo4j-driver";
import { IMediaRepository } from "../interfaces/repositories/media.interface";
import { IPostRepository } from "../interfaces/repositories/post.interface";

export interface IReactionService {
  react(reaction: Reaction, tx: Transaction): Promise<void>
  unreact(reaction: Reaction, tx: Transaction): Promise<void>
}

@Injectable()
export class ReactionService implements IReactionService {
  constructor(
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IMediaRepository")
    private _mediaRepo: IMediaRepository
  ) { }
  async unreact(reaction: Reaction, tx: Transaction): Promise<void> {
    if (reaction.target instanceof Post) {
      await this._postRepo.setTransaction(tx).deleteReact(reaction)
      return
    }
    if (reaction.target instanceof Media) {
      await this._mediaRepo.setTransaction(tx).deleteReaction(reaction)
      return
    }
  }

  async react(reaction: Reaction, tx: Transaction): Promise<void> {
    if (reaction.target instanceof Post) {
      await this._postRepo.setTransaction(tx).reactPost(reaction)
      return
    }
    if (reaction.target instanceof Media) {
      await this._mediaRepo.setTransaction(tx).reactMedia(reaction)
      return
    }
  }
}
