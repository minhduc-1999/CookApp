import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Food } from "domains/core/food.domain";
import { FoodIngredient } from "domains/core/ingredient.domain";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { FoodSave } from "domains/core/foodSave.domain";
import { FoodEntity } from "entities/core/food.entity";
import { RecipeStepEntity } from "entities/core/recipeStep.entity";
import { FoodSaveEntity } from "entities/core/foodSave.entity";
import { InteractionEntity } from "entities/social/interaction.entity";
import { In, QueryRunner, Repository } from "typeorm";
import { FoodSaveType } from "enums/core.enum";

export interface IFoodRepository {
  getFoods(query: PageOptionsDto): Promise<[Food[], number]>;
  getUncensoredFoods(query: PageOptionsDto): Promise<[Food[], number]>;
  setTransaction(tx: ITransaction): IFoodRepository;
  getById(id: string): Promise<Food>;
  getByIds(ids: string[]): Promise<Food[]>;
  getSteps(foodId: string): Promise<RecipeStep[]>;
  getIngredients(foodId: string): Promise<FoodIngredient[]>;
  insertFood(food: Food): Promise<Food>;
  updateFood(food: Food, data: Partial<Food>): Promise<void>;
  saveFood(save: FoodSave): Promise<void>;
  getFoodSave(
    userId: string,
    foodId: string,
    type: FoodSaveType
  ): Promise<Food>;
  getFoodSaves(userId: string): Promise<[Food[], number]>;
}

@Injectable()
export class FoodRepository extends BaseRepository implements IFoodRepository {
  constructor(
    @InjectRepository(FoodEntity)
    private _foodRepo: Repository<FoodEntity>,
    @InjectRepository(FoodSaveEntity)
    private _foodSaveRepo: Repository<FoodSaveEntity>
  ) {
    super();
  }
  async getFoodSaves(userId: string): Promise<[Food[], number]> {
    const [entities, total] = await this._foodSaveRepo.findAndCount({
      relations: ["food"],
      where: {
        user: {
          id: userId,
        },
      },
    });
    return [entities?.map((entity) => entity.toDomain()), total];
  }
  async getFoodSave(
    userId: string,
    foodId: string,
    type: FoodSaveType
  ): Promise<Food> {
    const entity = await this._foodSaveRepo.findOne({
      relations: ["food"],
      where: {
        user: {
          id: userId,
        },
        food: {
          id: foodId,
        },
        type,
      },
    });
    return entity?.toDomain();
  }

  async saveFood(save: FoodSave): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const foodSaveEntity = new FoodSaveEntity(save);
      await queryRunner.manager.save<FoodSaveEntity>(foodSaveEntity);
    }
  }

  async updateFood(food: Food, data: Partial<Food>): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const updateData = new FoodEntity(food).update(data);
      await queryRunner.manager.update<FoodEntity>(
        FoodEntity,
        { id: food.id },
        updateData
      );
    }
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

  async getIngredients(foodId: string): Promise<FoodIngredient[]> {
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
      relations: ["medias", "author"],
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
      .leftJoinAndSelect("food.author", "author")
      .leftJoinAndSelect("food.medias", "media")
      .leftJoinAndSelect("food.steps", "step")
      .leftJoinAndSelect("step.interaction", "stepInter")
      .leftJoinAndSelect("step.medias", "stepMedia")
      .where("food.id = :id", { id })
      .select([
        "food",
        "ingredient",
        "step",
        "author",
        "media",
        "stepInter",
        "stepMedia",
      ])
      .getOne();

    return entity?.toDomain();
  }

  async getFoods(query: PageOptionsDto): Promise<[Food[], number]> {
    const [foodEntities, total] = await this._foodRepo.findAndCount({
      relations: ["medias", "author"],
      where: {
        confirmed: true,
      },
      skip: query.limit * query.offset,
      take: query.limit,
    });
    return [foodEntities?.map((entity) => entity.toDomain()), total];
  }

  async getUncensoredFoods(query: PageOptionsDto): Promise<[Food[], number]> {
    const [foodEntities, total] = await this._foodRepo
      .createQueryBuilder("food")
      .leftJoinAndSelect("food.ingredients", "ingredient")
      .leftJoinAndSelect("food.author", "author")
      .leftJoinAndSelect("food.medias", "media")
      .leftJoinAndSelect("food.steps", "step")
      .leftJoinAndSelect("step.interaction", "stepInter")
      .leftJoinAndSelect("step.medias", "stepMedia")
      .where("food.confirmed = :confirm", { confirm: false })
      .select([
        "food",
        "ingredient",
        "step",
        "author",
        "media",
        "stepInter",
        "stepMedia",
      ])
      .skip(query.limit * query.offset)
      .take(query.limit)
      .getManyAndCount();
    return [foodEntities?.map((entity) => entity.toDomain()), total];
  }
}
