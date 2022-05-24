import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { FoodResponse } from "base/dtos/response.dto";
import { Food } from "domains/core/food.domain";

export class GetUncensoredFoodsResponse {
  @ApiResponseProperty({ type: [FoodResponse] })
  foods: FoodResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(foods: Food[], meta: PageMetadata) {
    this.foods = foods.map(food => new FoodResponse(food));
    this.metadata = meta;
  }
}
