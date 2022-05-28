import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { Food } from "domains/core/food.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFoodRepository } from "../adapters/out/repositories/food.repository";

export interface IFoodService {
  getByIds(ids: string[]): Promise<Food[]>;
  getById(id: string): Promise<Food>;
  fullfillData(food: Food): Promise<Food>;
}

@Injectable()
export class FoodService implements IFoodService {
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}

  async fullfillData(food: Food): Promise<Food> {
    if (!food) return food
    if (food.author) {
      [food.author.avatar] = await this._storageService.getDownloadUrls([
        food.author.avatar,
      ]);
    }
    food.photos = await this._storageService.getDownloadUrls(food.photos);
    return food
  }

  async getById(id: string): Promise<Food> {
    const food = await this._foodRepo.getById(id);
    if (!food)
      throw new NotFoundException(
        ResponseDTO.fail("Food not found", UserErrorCode.FOOD_NOT_FOUND)
      );
      return this.fullfillData(food)
  }

  async getByIds(ids: string[]): Promise<Food[]> {
    const foods = await this._foodRepo.getByIds(ids);
    for (let food of foods) {
      if (food.author) {
        [food.author.avatar] = await this._storageService.getDownloadUrls([
          food.author.avatar,
        ]);
      }
      food.photos = await this._storageService.getDownloadUrls(food.photos);
    }
    return foods;
  }
}
