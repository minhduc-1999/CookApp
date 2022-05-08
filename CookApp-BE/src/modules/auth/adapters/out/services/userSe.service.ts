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
  insertNewUserDoc(user: User): Promise<void>;
  updateUserDoc(user: User): Promise<void>;
  findManyByInterestsTopic(topic: string[]): Promise<string[]>;
}

@Injectable()
export class UserSeService implements IUserSeService {
  constructor(
    @InjectModel(UserItem.name) private _userModel: Model<UserDocument>
  ) {}

  async findManyByInterestsTopic(topic: string[]): Promise<string[]> {
    const result = await this._userModel.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: topic,
            path: "interests",
          },
        },
      },{
        $project: {
          _id: 1
        }
      }
    ]);
    return result?.map(user => user._id)
  }

  async updateUserDoc(user: User): Promise<void> {
    const item = new UserItem(user);
    await this._userModel.updateOne(
      {
        _id: item._id,
      },
      {
        $set: item.getUpdateData(),
      }
    );
  }

  async insertNewUserDoc(user: User): Promise<void> {
    const item = new UserItem(user);
    await this._userModel.insertMany([item]);
  }

  async findManyAndCount(
    term: string,
    opt: PageOptionsDto
  ): Promise<[string[], number]> {
    const result = await this._userModel.aggregate([
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                text: {
                  query: term,
                  path: "displayName",
                },
              },
              {
                text: {
                  query: term,
                  path: "email",
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: opt.limit * opt.offset },
            { $limit: opt.limit },
            { $project: { _id: 1 } },
          ],
        },
      },
    ]);
    if (result[0].data.length === 0) return [[], 0];
    const ids = result[0].data.map((user: any) => user._id);
    const total = result[0].metadata[0].total;
    return [ids, total];
  }
}
