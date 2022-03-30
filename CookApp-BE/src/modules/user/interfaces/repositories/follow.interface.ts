import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Follow } from "domains/social/follow.domain";
import { User } from "domains/social/user.domain";

export interface IFollowRepository {
  createFollower(follow: Follow): Promise<void>;
  deleteFollower(follow: Follow): Promise<void>;
  getFollow(follower: string, followee: string): Promise<Follow>;
  getFollowers(userId: string, query?: PageOptionsDto): Promise<[User[], number]>
  getFollowees(userId: string, query?: PageOptionsDto): Promise<[User[], number]>
  setTransaction(tx: ITransaction): IFollowRepository
}
