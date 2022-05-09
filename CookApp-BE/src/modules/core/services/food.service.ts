import { Inject, Injectable } from "@nestjs/common";
import { Food } from "domains/core/food.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFoodRepository } from "../adapters/out/repositories/food.repository";

export interface IFoodService {
  getByIds(ids: string[]): Promise<Food[]>;
}

@Injectable()
export class FoodService implements IFoodService {
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}
  async getByIds(ids: string[]): Promise<Food[]> {
    const foods = await this._foodRepo.getByIds(ids);
    for (let food of foods) {
      if (food.author) {
        [food.author.avatar] = await this._storageService.getDownloadUrls([food.author.avatar])
      }
      food.photos = await this._storageService.getDownloadUrls(food.photos)
    }
    return foods;
  }
}
