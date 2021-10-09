import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ResponseMetaDTO } from "base/dtos/responseMeta.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { ProfileDTO, UpdateProfileDTO } from "../dtos/profile.dto";
import { UserDTO } from "../dtos/user.dto";

export interface IUserService {
  getProfile(id: string): Promise<UserDTO>;
  updateProfile(
    userId: string,
    profileDto: UpdateProfileDTO
  ): Promise<UserDTO>;
}
@Injectable()
class UserService implements IUserService {
  constructor(@Inject("IUserRepository") private _userRepo: IUserRepository) {}
  async updateProfile(
    userId: string,
    profileDto: UpdateProfileDTO
  ): Promise<UserDTO> {
    const user = await this._userRepo.getUserById(userId);
    if (!user)
      throw new BadRequestException(
        ResponseMetaDTO.fail("User not found", ErrorCode.USER_NOT_FOUND)
      );
    const updatedUser = await this._userRepo.updateUserProfile(
      userId,
      profileDto
    );
    return updatedUser;
  }
  async getProfile(id: string): Promise<UserDTO> {
    return await this._userRepo.getUserById(id);
  }
}

export default UserService;
