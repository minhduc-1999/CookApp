import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "modules/auth/domains/schemas/user.schema";
import { RegisterDTO } from "modules/auth/dtos/createUser.dto";
import { UpdateProfileDTO } from "modules/auth/dtos/profile.dto";
import { Model } from "mongoose";

export interface IUserRepository {
  createUser(userData: RegisterDTO): Promise<UserDocument>;
  getUserByEmail(email: string): Promise<UserDocument>;
  getUserByUsername(username: string): Promise<UserDocument>;
  getUserById(id: string): Promise<UserDocument>;
  updateUserProfile(userId: string, profile: NonNullable<UpdateProfileDTO>);
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>
  ) {}
  updateUserProfile(userId: string, profile: NonNullable<UpdateProfileDTO>) {
    return this._userModel.findOneAndUpdate({ _id: userId }, profile, {
      new: true,
    });
  }

  getUserById(id: string): Promise<UserDocument> {
    return this._userModel.findOne({ id: id }).exec();
  }
  async getUserByEmail(email: string): Promise<UserDocument> {
    return this._userModel.findOne({ email: email }).exec();
  }
  getUserByUsername(username: string): Promise<UserDocument> {
    return this._userModel.findOne({ username: username }).exec();
  }
  createUser(userData: RegisterDTO): Promise<UserDocument> {
    const createdUser = new this._userModel(userData);
    return createdUser.save();
  }
}
