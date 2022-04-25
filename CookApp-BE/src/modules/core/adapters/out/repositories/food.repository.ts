import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Food } from "domains/core/food.domain";
import { Ingredient } from "domains/core/ingredient.domain";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { FoodEntity } from "entities/core/food.entity";
import { RecipeStepEntity } from "entities/core/recipeStep.entity";
import { InteractionEntity } from "entities/social/interaction.entity";
import { In, QueryRunner, Repository } from "typeorm";
import { inspectObj } from "utils";

export interface IFoodRepository {
  getFoods(query: PageOptionsDto): Promise<[Food[], number]>;
  setTransaction(tx: ITransaction): IFoodRepository;
  getById(id: string): Promise<Food>;
  getByIds(ids: string[]): Promise<Food[]>;
  getSteps(foodId: string): Promise<RecipeStep[]>;
  getIngredients(foodId: string): Promise<Ingredient[]>;
  insertFood(food: Food): Promise<Food>;
}

@Injectable()
export class FoodRepository extends BaseRepository implements IFoodRepository {
  constructor(
    @InjectRepository(FoodEntity)
    private _foodRepo: Repository<FoodEntity>
  ) {
    super();
  }
  async insertFood(food: Food): Promise<Food> {
    if (!food) return null;
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const foodEntity = new FoodEntity(food);
      const savedFood = await queryRunner.manager.save<FoodEntity>(foodEntity);
      const recipes = food.steps.map((step) => {
        const temp = new RecipeStepEntity(step, savedFood.toDomain());
        const recipe = new InteractionEntity(step);
        recipe.recipeStep = temp;
        return recipe;
      });
      await queryRunner.manager.save<InteractionEntity>(recipes);
      return savedFood?.toDomain();
    }
    return null;
  }

  async getIngredients(foodId: string): Promise<Ingredient[]> {
    const entity = await this._foodRepo.findOne({
      relations: ["ingredients"],
      where: {
        id: foodId,
      },
    });
    return entity?.toDomain().ingredients;
  }

  async getSteps(foodId: string): Promise<RecipeStep[]> {
    const entity = await this._foodRepo.findOne({
      relations: ["steps"],
      where: {
        id: foodId,
      },
    });
    return entity?.toDomain().steps;
  }

  async getByIds(ids: string[]): Promise<Food[]> {
    const entities = await this._foodRepo.find({
      relations: ["medias"],
      where: {
        id: In(ids),
      },
    });
    return entities?.map((entity) => entity.toDomain());
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
      .getOne();

    return entity?.toDomain();
  }
  async getFoods(query: PageOptionsDto): Promise<[Food[], number]> {
    const [foodEntities, total] = await this._foodRepo.findAndCount({
      relations: ["medias"],
      skip: query.limit * query.offset,
      take: query.limit,
    });
    return [foodEntities?.map((entity) => entity.toDomain()), total];
  }
}
