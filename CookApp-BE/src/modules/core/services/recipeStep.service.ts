import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { IRecipeStepRepository } from "../adapters/out/repositories/recipeStep.repository";

export interface IFoodRecipeService {
  getStepById(id: string): Promise<RecipeStep>
}


@Injectable()
export class FoodRecipeService implements IFoodRecipeService {
  constructor(
    @Inject("IRecipeStepRepository")
    private _recipeRepo: IRecipeStepRepository,
  ) { }

  async getStepById(id: string): Promise<RecipeStep> {
    const step = await this._recipeRepo.getById(id)
    if (!step) {
      throw new NotFoundException(
        ResponseDTO.fail("Step not found")
      );
    }
    return step
  }
}
