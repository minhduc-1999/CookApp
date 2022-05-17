import { User } from "domains/social/user.domain";
import { PageOptionsDto } from "base/pageOptions.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";

export interface IUserRepository {
  createUser(userData: User): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getUserByUsername(username: string): Promise<User>;
  getUserById(id: string): Promise<User>;
  updateUserProfile(user: User): Promise<void>;
  setTransaction(tx: ITransaction): IUserRepository
  getUsers(query: PageOptionsDto): Promise<[User[], number]>;
  updateStatus(user: User, statusID?: string): Promise<void>
  getProfile(userId: string): Promise<User>
  existAll(userIds: string[]): Promise<boolean>
  getUsersByIds(ids: string[]): Promise<User[]>
}
