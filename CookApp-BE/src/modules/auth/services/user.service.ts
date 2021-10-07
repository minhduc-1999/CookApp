import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { Result } from "base/result.base";
import { ErrorCode } from "enums/errorCode.enum";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { ProfileDTO, UpdateProfileDTO } from "../dtos/profile.dto";
import { UserDTO } from "../dtos/user.dto";

export interface IUserService {
  getProfile(id: string): Promise<UserDTO>;
  updateProfile(userId: string, profileDto: UpdateProfileDTO): Promise<UserDTO>;
}
@Injectable()
class UserService implements IUserService {
  constructor(@Inject("IUserRepository") private _userRepo: IUserRepository) {}
  async updateProfile(userId: string, profileDto: UpdateProfileDTO): Promise<UserDTO> {
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new NotFoundException(ResponseDTO.fail('User not found', ErrorCode.USER_NOT_FOUND))
    const a = await this._userRepo.updateUserProfile(userId, profileDto)
    console.log("", a)
    return null;
  }
  async getProfile(id: string): Promise<UserDTO> {
    return new UserDTO(await this._userRepo.getUserById(id));
  }
}

export default UserService;
