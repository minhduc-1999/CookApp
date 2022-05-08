import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FoodDocument, FoodItem } from "modules/core/entities/se/food.schema";
import { PageOptionsDto } from "base/pageOptions.base";
import { Food } from "domains/core/food.domain";

export interface IFoodSeService {
  findManyByNameAndCount(
    name: string,
    opt: PageOptionsDto
  ): Promise<[string[], number]>;
  findOneByName(name: string): Promise<string>;
  insertNewFood(food: Food): Promise<void>;
}

@Injectable()
export class FoodSeService implements IFoodSeService {
  constructor(
    @InjectModel(FoodItem.name) private _foodModel: Model<FoodDocument>
  ) {}

  async insertNewFood(food: Food): Promise<void> {
    const item = new FoodItem(food);
    await this._foodModel.insertMany([item]);
  }

  async findOneByName(term: string): Promise<string> {
    const result = await this._foodModel.aggregate([
      {
        $search: {
          index: "food_search_index",
          text: {
            query: term,
            path: "name"
          }
        }
      },
      { $limit: 1 },
      { $project: { _id: 1 } },
    ]);
    if (result.length === 0)
      return null
    return result[0]?._id
  }

  async findManyByNameAndCount(
    term: string,
    opt: PageOptionsDto
  ): Promise<[string[], number]> {
    const result = await this._foodModel.aggregate([
      {
        $search: {
          index: "food_search_index",
          compound: {
            should: [
              {
                text: {
                  query: term,
                  path: "name",
                },
              },
              {
                text: {
                  query: term,
                  path: "description",
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
