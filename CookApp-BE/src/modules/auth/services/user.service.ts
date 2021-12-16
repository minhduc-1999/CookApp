import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserDTO } from "dtos/social/user.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { takeField } from "utils";
import { IUserRepository } from "../adapters/out/repositories/user.repository";

export interface IUserService {
  getUserById(userId: string): Promise<UserDTO>;
  getUserPublicInfo(userId: string): Promise<UserDTO>;
}
@Injectable()
class UserService implements IUserService {
  constructor(@Inject("IUserRepository") private _userRepo: IUserRepository) {}
  async getUserPublicInfo(userId: string): Promise<UserDTO> {
    const user = await this._userRepo.getUserById(userId);
    if (!user)
      throw new BadRequestException(
        ResponseDTO.fail("User not found", ErrorCode.USER_NOT_FOUND)
      );
    return takeField(user, ["displayName", "id", "avatar"]);
  }
  async getUserById(userId: string): Promise<UserDTO> {
    const user = await this._userRepo.getUserById(userId);
    if (!user)
      throw new BadRequestException(
        ResponseDTO.fail("User not found", ErrorCode.USER_NOT_FOUND)
      );
    return user;
  }
}

export default UserService;
