import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Reaction } from "domains/social/reaction.domain";

export interface IReactionRepository {
  setTransaction(tx: ITransaction): IReactionRepository
  create(reaction: Reaction): Promise<void>;
  delete(reaction: Reaction): Promise<void>;
  findById(userId: string, targetId: string): Promise<Reaction>;
  findByIds(userId: string, targetIds: string[]): Promise<Reaction[]>;
}
