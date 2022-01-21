import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Food, FoodDocument } from "domains/schemas/core/food.schema";
import { FoodDTO } from "dtos/core/food.dto";
import { Model } from "mongoose";
import { Transaction } from "neo4j-driver";

export interface IFoodRepository {
  getFoods(query: PageOptionsDto): Promise<FoodDTO[]>;
  getTotalFoods(query: PageOptionsDto): Promise<number>;
  setTransaction(tx: Transaction): IFoodRepository
}

@Injectable()
export class FoodRepository extends BaseRepository implements IFoodRepository {
  private logger: Logger = new Logger(FoodRepository.name);
  constructor(@InjectModel(Food.name) private _foodModel: Model<FoodDocument>) {
    super();
  }

  async getTotalFoods(query: PageOptionsDto): Promise<number> {
    let textSearch = {};
    if (query.q == "") textSearch = {};
    else textSearch = { $text: { $search: query.q } };
    return this._foodModel.count(textSearch).exec();
  }

  async getFoods(query: PageOptionsDto): Promise<FoodDTO[]> {
    let textSearch = {};
    if (query.q == "") textSearch = {};
    else textSearch = { $text: { $search: query.q } };
    const foods = await this._foodModel
      .find(textSearch)
      .skip(query.limit * query.offset)
      .limit(query.limit);
    if (foods.length < 1) return [];
    return foods.map((food) =>
      plainToClass(FoodDTO, food, {
        excludeExtraneousValues: true,
      })
    );
  }
}
