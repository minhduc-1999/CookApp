import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "modules/auth/domains/schemas/user.schema";
import { RegisterDTO } from "modules/auth/dtos/createUser.dto";
import { Model } from "mongoose";

export interface IUserRepository {
  createUser(userData: RegisterDTO): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getUserByUsername(username: string): Promise<User>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>
  ) {}
  async getUserByEmail(email: string): Promise<User> {
    return this._userModel.findOne({ email: email }).exec();
  }
  getUserByUsername(username: string): Promise<User> {
    return this._userModel.findOne({ username: username }).exec();
  }
  createUser(userData: RegisterDTO): Promise<User> {
    const createdUser = new this._userModel(userData);
    return createdUser.save();
  }
}
