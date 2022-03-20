import { User } from "domains/social/user.domain";
import { PageOptionsDto } from "base/pageOptions.base";
import { Transaction } from "neo4j-driver";

export interface IUserRepository {
  createUser(userData: User): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getUserByUsername(username: string): Promise<User>;
  getUserById(id: string): Promise<User>;
  updateUserProfile(
    userId: string,
    profile: Partial<User>
  ): Promise<User>;
  setTransaction(tx: Transaction): IUserRepository
  getUsers(query: PageOptionsDto): Promise<User[]>;
  countUsers(query: PageOptionsDto): Promise<number>;
  updateStatus(user: User, statusID?: string): Promise<void>
}
