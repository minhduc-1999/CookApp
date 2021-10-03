import {
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "modules/auth/domains/schemas/user.schema";
import { RegisterDTO } from "modules/auth/dtos/createUser.dto";
import { Model } from "mongoose";

export interface IUserRepository {
  createUser(userData: RegisterDTO): Promise<UserDocument>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>
  ) {}
  createUser(userData: RegisterDTO): Promise<UserDocument> {
    const createdUser = new this._userModel(userData);
    return createdUser.save();
  }
}
