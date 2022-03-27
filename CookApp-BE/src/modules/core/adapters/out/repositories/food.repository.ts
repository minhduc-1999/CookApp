import { Injectable, Logger } from "@nestjs/common";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Food } from "domains/core/food.domain";

export interface IFoodRepository {
  getFoods(query: PageOptionsDto): Promise<Food[]>;
  getTotalFoods(query: PageOptionsDto): Promise<number>;
  setTransaction(tx: ITransaction): IFoodRepository
}

@Injectable()
export class FoodRepository extends BaseRepository implements IFoodRepository {
  private logger: Logger = new Logger(FoodRepository.name);
  constructor() {
    super();
  }
    getFoods(query: PageOptionsDto): Promise<Food[]> {
        throw new Error("Method not implemented.");
    }
    getTotalFoods(query: PageOptionsDto): Promise<number> {
        throw new Error("Method not implemented.");
    }
}
