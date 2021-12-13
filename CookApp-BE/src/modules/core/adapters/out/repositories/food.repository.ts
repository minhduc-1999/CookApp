import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Food, FoodDocument } from "domains/schemas/core/food.schema";
import { FoodDTO } from "dtos/core/food.dto";
import { ClientSession, Model } from "mongoose";

export interface IFoodRepository {
  getFoods(query: PageOptionsDto): Promise<FoodDTO[]>;
  getTotalFoods(): Promise<number>;
  setSession(session: ClientSession): IFoodRepository;
}

@Injectable()
export class FoodRepository extends BaseRepository implements IFoodRepository {
  private logger: Logger = new Logger(FoodRepository.name);
  constructor(@InjectModel(Food.name) private _foodModel: Model<FoodDocument>) {
    super();
  }

  async getTotalFoods(): Promise<number> {
    const numOfFood = await this._foodModel.count().exec();
    return numOfFood;
  }

  async getFoods(query: PageOptionsDto): Promise<FoodDTO[]> {
    const foods = await this._foodModel
      .find()
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
