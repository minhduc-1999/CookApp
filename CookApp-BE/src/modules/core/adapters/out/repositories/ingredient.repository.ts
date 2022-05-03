import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Ingredient } from "domains/core/ingredient.domain";
import { IngredientEntity } from "entities/core/ingredient.entity";
import { Repository } from "typeorm";

export interface IIngredientRepository {
  getIngredients(query: PageOptionsDto): Promise<[Ingredient[], number]>;
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
