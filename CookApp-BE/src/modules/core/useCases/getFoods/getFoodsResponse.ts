import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { FoodResponse } from "base/dtos/response.dto";

export class GetFoodsResponse {
  @ApiResponseProperty({ type: [FoodResponse] })
  foods: FoodResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(foods: FoodResponse[], meta: PageMetadata) {
    this.foods = foods
    this.metadata = meta;
  }
}
