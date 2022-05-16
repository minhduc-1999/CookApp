import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Ingredient } from "domains/core/ingredient.domain";
import { IngredientEntity } from "entities/core/ingredient.entity";
import { QueryRunner, Repository } from "typeorm";

export interface IIngredientRepository {
  getIngredients(query: PageOptionsDto): Promise<[Ingredient[], number]>;
  insertIngredient(ingredient: Ingredient): Promise<Ingredient>;
  setTransaction(tx: ITransaction): IIngredientRepository;
}

@Injectable()
export class IngredientRepository
  extends BaseRepository
  implements IIngredientRepository
{
  constructor(
    @InjectRepository(IngredientEntity)
    private _ingredientRepo: Repository<IngredientEntity>
  ) {
    super();
  }
  async insertIngredient(ingredient: Ingredient): Promise<Ingredient> {
    if (!ingredient) return null;
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const ingreEntity = new IngredientEntity(ingredient);
      const savedIngredient = await queryRunner.manager.save<IngredientEntity>(
        ingreEntity
      );
      return savedIngredient?.toDomain();
    }
    return null;
  }

  async getIngredients(query: PageOptionsDto): Promise<[Ingredient[], number]> {
    const [ingredientEntities, total] = await this._ingredientRepo.findAndCount(
      {
        skip: query.limit * query.offset,
        take: query.limit,
      }
    );
    return [ingredientEntities?.map((entity) => entity.toDomain()), total];
  }
}
