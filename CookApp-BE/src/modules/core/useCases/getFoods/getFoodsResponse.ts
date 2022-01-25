import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { Type } from "class-transformer";
import { FoodDTO } from "domains/core/food.dto";

export class GetFoodsResponse {
  @ApiResponseProperty({ type: [FoodDTO] })
  @Type(() => FoodDTO)
  foods: FoodDTO[];

  @ApiResponseProperty({ type: PageMetadata })
  @Type(() => PageMetadata)
  metadata: PageMetadata;

  constructor(foods: FoodDTO[], meta: PageMetadata) {
    this.foods = foods;
    this.metadata = meta;
  }
}
