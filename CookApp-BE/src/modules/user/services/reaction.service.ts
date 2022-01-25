import { Inject, Injectable } from "@nestjs/common";
import { PostDTO } from "dtos/social/post.dto";
import { ReactionDTO } from "dtos/social/reaction.dto";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "../interfaces/repositories/post.interface";

export interface IReactionService {
  react(reaction: ReactionDTO, tx: Transaction): Promise<void>
  unreact(reaction: ReactionDTO, tx: Transaction): Promise<void>
}

@Injectable()
export class ReactionService implements IReactionService {
  constructor(
    @Inject("IPostRepository")
    private _postRepo: IPostRepository
  ) { }
  async unreact(reaction: ReactionDTO, tx: Transaction): Promise<void> {
    if (reaction.target instanceof PostDTO) {
      await this._postRepo.setTransaction(tx).deleteReact(reaction)
    }
  }
  async react(reaction: ReactionDTO, tx: Transaction): Promise<void> {
    if (reaction.target instanceof PostDTO) {
      await this._postRepo.setTransaction(tx).reactPost(reaction)
    }
  }
}
