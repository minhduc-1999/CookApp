import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { FoodResponse } from "base/dtos/response.dto";
import { Food } from "domains/core/food.domain";
import { FoodSaveType } from "enums/core.enum";

export class GetFoodSavesResponse {
  @ApiResponseProperty({ type: [FoodResponse] })
  foods: FoodResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(foods: Food[], meta: PageMetadata, saveType: FoodSaveType) {
    this.foods = foods.map((food) => new FoodResponse(food, null, saveType));
    this.metadata = meta;
  }
}
