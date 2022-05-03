import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { RecipeStepResponse, ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
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
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IReactionRepository")
    private _reacRepo: IReactionRepository,
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}
  async execute(query: GetFoodDetailQuery): Promise<GetFoodDetailResponse> {
    const { foodId, user } = query;

    const food = await this._foodRepo.getById(foodId);

    if (!food) {
      throw new NotFoundException(
        ResponseDTO.fail("Food not found", UserErrorCode.FOOD_NOT_FOUND)
      );
    }

    food.photos = await this._storageService.getDownloadUrls(food.photos);
    if (food.author?.avatar?.key)
      [food.author.avatar] = await this._storageService.getDownloadUrls([
        food.author.avatar,
      ]);
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

    return new GetFoodDetailResponse(food, stepsResponse);
  }
}
