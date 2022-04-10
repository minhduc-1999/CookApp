import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseRepository } from "base/repository.base";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { RecipeStepEntity } from "entities/core/recipeStep.entity";
import { Repository } from "typeorm";

export interface IRecipeStepRepository {
  setTransaction(tx: ITransaction): IRecipeStepRepository
  getById(id: string): Promise<RecipeStep>
}

@Injectable()
export class RecipeStepRepository extends BaseRepository implements IRecipeStepRepository {
  constructor(
    @InjectRepository(RecipeStepEntity)
    private _foodRepo: Repository<RecipeStepEntity>
  ) {
    super();
  }
  async getById(id: string): Promise<RecipeStep> {
    const entity = await this._foodRepo
      .createQueryBuilder("step")
      .leftJoinAndSelect("step.interaction", "interaction")
      .where("step.id = :id", { id })
      .select(["step", "interaction"])
      .getOne()

    return entity?.toDomain()
  }
}
