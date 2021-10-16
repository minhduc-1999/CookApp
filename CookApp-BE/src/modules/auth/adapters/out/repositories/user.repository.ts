import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "modules/auth/domains/schemas/user.schema";
import { RegisterDTO } from "modules/auth/dtos/register.dto";
import { UpdateProfileDTO } from "modules/auth/dtos/profile.dto";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { Model } from "mongoose";
import { ResponseMetaDTO } from "base/dtos/responseMeta.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { MongoErrorCode } from "enums/mongoErrorCode.enum";
import { createUpdatingNestedObject } from "utils";

export interface IUserRepository {
  createUser(userData: RegisterDTO): Promise<UserDTO>;
  getUserByEmail(email: string): Promise<UserDTO>;
  getUserByUsername(username: string): Promise<UserDTO>;
  getUserById(id: string): Promise<UserDTO>;
  updateUserProfile(
    userId: string,
    profile: UpdateProfileDTO
  ): Promise<UserDTO>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>
  ) {}

  async updateUserProfile(
    userId: string,
    profile: UpdateProfileDTO
  ): Promise<UserDTO> {
    const updatingProfile = createUpdatingNestedObject<UpdateProfileDTO>('profile', profile)
    const userDoc = await this._userModel.findByIdAndUpdate(
      userId,
      { $set: updatingProfile },
      {
        new: true,
      }
    );
    if (!userDoc) return null;
    const user = new UserDTO(userDoc);
    return user;
  }

  async getUserById(id: string): Promise<UserDTO> {
    const userDoc = await this._userModel.findOne({ id: id }).exec();
    if (!userDoc) return null;
    const userDto = new UserDTO(userDoc);
    return userDto;
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    const userDoc = await this._userModel.findOne({ email: email }).exec();
    if (!userDoc) return null;
    const userDto = new UserDTO(userDoc);
    return userDto;
  }

  async getUserByUsername(username: string): Promise<UserDTO> {
    const userDoc = await this._userModel
      .findOne({ username: username })
      .exec();
    if (!userDoc) return null;
    const userDto = new UserDTO(userDoc);
    return userDto;
  }

  async createUser(userData: RegisterDTO): Promise<UserDTO> {
    const createdUser = new this._userModel(new User(userData));
    try {
      const userDoc = await createdUser.save();
      if (!userDoc) return null;
      const userDto = new UserDTO(userDoc);
      return userDto;
    } catch (error) {
      console.error(error)
      if (error.code === MongoErrorCode.DUPLICATE_KEY)
        throw new BadRequestException(
          ResponseMetaDTO.fail(
            "This user is already existed",
            ErrorCode.ACCOUNT_ALREADY_EXISTED
          )
        );
      throw new InternalServerErrorException();
    }    
  }
}
