import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../domains/schemas/user.schema";

@Injectable()
class UsersService {
  constructor(@InjectModel(User.name) private _userModel: Model<UserDocument>) {}
}

export default UsersService;
