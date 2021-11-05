import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { UserDTO } from "../dtos/user.dto";

export interface IUserService {
  getUserById(userId: string): Promise<UserDTO>;
}
@Injectable()
class UserService implements IUserService {
  constructor(@Inject("IUserRepository") private _userRepo: IUserRepository) {}
  async getUserById(userId: string): Promise<UserDTO> {
    const user = await this._userRepo.getUserById(userId);
    if (!user)
      throw new BadRequestException(
        ResponseDTO.fail("User not found", ErrorCode.USER_NOT_FOUND)
      );
    return user
  }
}

export default UserService;
