import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Food } from "domains/core/food.domain";
import { FoodEntity } from "entities/core/food.entity";
import { In, Repository } from "typeorm";

export interface IFoodRepository {
  getFoods(query: PageOptionsDto): Promise<[Food[], number]>;
  setTransaction(tx: ITransaction): IFoodRepository
  getById(id: string): Promise<Food>
  getByIds(ids: string[]): Promise<Food[]>
}

@Injectable()
export class FoodRepository extends BaseRepository implements IFoodRepository {
  constructor(
    @InjectRepository(FoodEntity)
    private _foodRepo: Repository<FoodEntity>
  ) {
    super();
  }
  async getByIds(ids: string[]): Promise<Food[]> {
    const entities = await this._foodRepo.find({
      relations: ["medias"],
      where: {
        id: In(ids)
      }
    })
    return entities?.map(entity => entity.toDomain())
  }

  async getById(id: string): Promise<Food> {
    const entity = await this._foodRepo
      .createQueryBuilder("food")
      .leftJoinAndSelect("food.ingredients", "ingredient")
      .leftJoinAndSelect("food.medias", "media")
      .leftJoinAndSelect("food.steps", "step")
      .leftJoinAndSelect("step.interaction", "stepInter")
      .leftJoinAndSelect("step.medias", "stepMedia")
      .where("food.id = :id", { id })
      .select(["food", "ingredient", "step", "media", "stepInter", "stepMedia"])
      .getOne()

    return entity?.toDomain()
  }
  async getFoods(query: PageOptionsDto): Promise<[Food[], number]> {
    const [foodEntities, total] = await this._foodRepo.findAndCount({
      relations: ["medias"],
      skip: query.limit * query.offset,
      take: query.limit
    })
    return [
      foodEntities?.map(entity => entity.toDomain()),
      total
    ]
  }
}
