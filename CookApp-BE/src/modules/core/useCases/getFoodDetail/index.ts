import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { RecipeStepResponse } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { IFoodService } from "modules/core/services/food.service";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { GetFoodDetailResponse } from "./getFoodDetailResponse";

export class GetFoodDetailQuery extends BaseQuery {
  foodId: string;
  constructor(user: User, foodId: string) {
    super(user);
    this.foodId = foodId;
  }
}

@QueryHandler(GetFoodDetailQuery)
export class GetFoodDetailQueryHandler
  implements IQueryHandler<GetFoodDetailQuery>
{
  constructor(
    @Inject("IFoodService") 
    private _foodService: IFoodService,
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IReactionRepository")
    private _reacRepo: IReactionRepository,
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}
  async execute(query: GetFoodDetailQuery): Promise<GetFoodDetailResponse> {
    const { foodId, user } = query;

    const food = await this._foodService.getById(foodId);

    let stepsResponse: RecipeStepResponse[];
    if (food.steps.length > 0) {
      stepsResponse = await Promise.all(
        food.steps.map(async (step) => {
          const react = await this._reacRepo.findById(user.id, step.id);
          const temp = {
            ...step,
            photos: await this._storageService.getDownloadUrls(step.photos),
          };
          return new RecipeStepResponse(temp, react);
        })
      );
    }
    const foodSave = await this._foodRepo.getFoodSave(user.id, food.id)

    return new GetFoodDetailResponse(food, stepsResponse, foodSave?.type);
  }
}
