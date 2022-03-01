import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { takeField } from "utils";
import { IUserRepository } from "../interfaces/repositories/user.interface";

export interface IUserService {
  getUserById(userId: string): Promise<User>;
  getUserPublicInfo(userId: string): Promise<User>;
  getUsersPublicInfo(queryOpt: PageOptionsDto): Promise<User[]>;
  getTotalUsers(queryOpt: PageOptionsDto): Promise<number>;
}
@Injectable()
class UserService implements IUserService {
  constructor(@Inject("IUserRepository") private _userRepo: IUserRepository) {}
  async getTotalUsers(queryOpt: PageOptionsDto): Promise<number> {
    return this._userRepo.countUsers(queryOpt);
  }
  async getUsersPublicInfo(queryOpt: PageOptionsDto): Promise<User[]> {
    const users = await this._userRepo.getUsers(queryOpt);
    return users.map((user) =>
      takeField(user, ["displayName", "id", "avatar"])
    );
  }
  async getUserPublicInfo(userId: string): Promise<User> {
    const user = await this._userRepo.getUserById(userId);
    if (!user)
      throw new BadRequestException(
        ResponseDTO.fail("User not found", UserErrorCode.USER_NOT_FOUND)
      );
    return takeField(user, ["displayName", "id", "avatar"]);
  }
  async getUserById(userId: string): Promise<User> {
    const user = await this._userRepo.getUserById(userId);
    if (!user)
      throw new BadRequestException(
        ResponseDTO.fail("User not found", UserErrorCode.USER_NOT_FOUND)
      );
    return user;
  }
}

export default UserService;
