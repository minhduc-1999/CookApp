import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorCode } from "enums/errorCode.enum";
import { MongoErrorCode } from "enums/mongoErrorCode.enum";
import { ResponseDTO } from "base/dtos/response.dto";
import { RegisterRequest } from "modules/auth/useCases/register/registerRequest";
import { UserDTO } from "dtos/user.dto";
import { User, UserDocument } from "domains/schemas/user.schema";

export interface IUserRepository {
  createUser(userData: RegisterRequest): Promise<UserDTO>;
  getUserByEmail(email: string): Promise<UserDTO>;
  getUserByUsername(username: string): Promise<UserDTO>;
  getUserById(id: string): Promise<UserDTO>;
  updateUserProfile(
    userId: string,
    profile: Partial<UserDTO>
  ): Promise<UserDTO>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>
  ) {}

  async updateUserProfile(
    userId: string,
    profile: Partial<UserDTO>
  ): Promise<UserDTO> {
    const userDoc = await this._userModel.findByIdAndUpdate(
      userId,
      { $set: profile },
      {
        new: true,
      }
    );
    return new UserDTO(userDoc);
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

  async createUser(userData: RegisterRequest): Promise<UserDTO> {
    const createdUser = new this._userModel(new User(userData));
    try {
      const userDoc = await createdUser.save();
      if (!userDoc) return null;
      const userDto = new UserDTO(userDoc);
      return userDto;
    } catch (error) {
      console.error(error);
      if (error.code === MongoErrorCode.DUPLICATE_KEY)
        throw new BadRequestException(
          ResponseDTO.fail(
            "This user is already existed",
            ErrorCode.ACCOUNT_ALREADY_EXISTED
          )
        );
      throw new InternalServerErrorException();
    }
  }
}
