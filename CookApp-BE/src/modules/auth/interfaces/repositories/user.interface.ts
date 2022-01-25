import { UserDTO } from "dtos/social/user.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { Transaction } from "neo4j-driver";

export interface IUserRepository {
  createUser(userData: UserDTO): Promise<UserDTO>;
  getUserByEmail(email: string): Promise<UserDTO>;
  getUserByUsername(username: string): Promise<UserDTO>;
  getUserById(id: string): Promise<UserDTO>;
  updateUserProfile(
    userId: string,
    profile: Partial<UserDTO>
  ): Promise<UserDTO>;
  setTransaction(tx: Transaction): IUserRepository
  getUsers(query: PageOptionsDto): Promise<UserDTO[]>;
  countUsers(query: PageOptionsDto): Promise<number>;
}
