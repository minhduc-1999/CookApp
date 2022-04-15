import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ResponseDTO } from "base/dtos/response.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IAccountRepository } from "../interfaces/repositories/account.interface";
import { IUserRepository } from "../interfaces/repositories/user.interface";

export interface IUserService {
  getUserById(userId: string): Promise<User>;
  getUsers(queryOpt: PageOptionsDto): Promise<[User[], number]>;
  createNewUser(user: User, tx: ITransaction): Promise<User>
}
@Injectable()
class UserService implements IUserService {
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    @Inject("IStorageService") private _storageService: IStorageService,
    @Inject("IAccountRepository") private _accountRepo: IAccountRepository
  ) { }

  async getUsers(queryOpt: PageOptionsDto): Promise<[User[], number]> {
    const [users, userCount] = await this._userRepo.getUsers(queryOpt);
    for (let user of users) {
      user.avatar = (await this._storageService.getDownloadUrls([user.avatar]))[0]
    }
    return [users, userCount]
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this._userRepo.getUserById(userId);
    if (!user)
      throw new NotFoundException(
        ResponseDTO.fail("User not found", UserErrorCode.USER_NOT_FOUND)
      );
    user.avatar = (await this._storageService.getDownloadUrls([user.avatar]))[0]
    return user;
  }

  async createNewUser(user: User, tx: ITransaction): Promise<User> {
    const newUser = await this._userRepo.setTransaction(tx).createUser(user)
    if (!newUser) {
      throw new InternalServerErrorException()
    }

    const account = await this._accountRepo.setTransaction(tx).createAccount(newUser.account, newUser) 
    if (!account) {
      throw new InternalServerErrorException()
    }

    return newUser;
  }
}

export default UserService;
