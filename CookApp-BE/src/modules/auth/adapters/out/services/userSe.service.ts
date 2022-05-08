import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { UserDocument, UserItem } from "modules/auth/entities/se/user.schema";

export interface IUserSeService {
  findManyAndCount(
    name: string,
    opt: PageOptionsDto
  ): Promise<[string[], number]>;
  findOne(name: string): Promise<string>;
  insertNewUserDoc(user: User): Promise<void>;
}

@Injectable()
export class UserSeService implements IUserSeService {
  constructor(
    @InjectModel(UserItem.name) private _userModel: Model<UserDocument>
  ) {}

  async insertNewUserDoc(user: User): Promise<void> {
    const item = new UserItem(user);
    await this._userModel.insertMany([item]);
  }

  async findOne(name: string): Promise<string> {
    const user = await this._userModel
      .findOne({
        $text: {
          $search: name,
        },
      })
      .sort({
        score: {
          $meta: "textScore",
        },
      });
    return user?._id;
  }

  async findManyAndCount(
    name: string,
    opt: PageOptionsDto
  ): Promise<[string[], number]> {
    const textSearch = {
      $text: { $search: name },
    };
    const users = await this._userModel
      .find(textSearch)
      .sort({
        score: {
          $meta: "textScore",
        },
      })
      .skip(opt.limit * opt.offset)
      .limit(opt.limit);
    const ids = users.map((user) => user._id);
    const numOfUser = await this._userModel.count(textSearch).exec();
    return [ids, numOfUser];
  }
}
