import { Inject, Injectable } from "@nestjs/common";
import { Post } from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "../interfaces/repositories/post.interface";

export interface IReactionService {
  react(reaction: Reaction, tx: Transaction): Promise<void>
  unreact(reaction: Reaction, tx: Transaction): Promise<void>
}

@Injectable()
export class ReactionService implements IReactionService {
  constructor(
    @Inject("IPostRepository")
    private _postRepo: IPostRepository
  ) { }
  async unreact(reaction: Reaction, tx: Transaction): Promise<void> {
    if (reaction.target instanceof Post) {
      await this._postRepo.setTransaction(tx).deleteReact(reaction)
    }
  }
  async react(reaction: Reaction, tx: Transaction): Promise<void> {
    if (reaction.target instanceof Post) {
      await this._postRepo.setTransaction(tx).reactPost(reaction)
    }
  }
}
