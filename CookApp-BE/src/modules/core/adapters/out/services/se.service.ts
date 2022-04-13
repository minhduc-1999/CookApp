import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FoodDocument, FoodItem } from 'modules/core/entities/se/food.schema';
import { PageOptionsDto } from 'base/pageOptions.base';

export interface IFoodSeService {
  findManyByNameAndCount(name: string, opt: PageOptionsDto): Promise<[string[], number]>
}

@Injectable()
export class FoodSeService implements IFoodSeService {
  constructor(@InjectModel(FoodItem.name) private _foodModel: Model<FoodDocument>) { }

  async findManyByNameAndCount(name: string, opt: PageOptionsDto): Promise<[string[], number]> {
    const textSearch = {
      $text: { $search: name }
    }
    const foods = await this._foodModel
      .find(textSearch)
      .skip(opt.limit * opt.offset)
      .limit(opt.limit);
    const ids = foods.map(food => food._id)
    const numOfFood = await this._foodModel.count(textSearch).exec();
    return [ids, numOfFood]
  }

}
