import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { IngredientResponse } from "base/dtos/response.dto";
import { Ingredient } from "domains/core/ingredient.domain";

export class GetIngredientsResponse {
  @ApiResponseProperty({ type: [IngredientResponse] })
  ingredients: IngredientResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(units: Ingredient[], meta: PageMetadata) {
    this.ingredients = units.map((unit) => new IngredientResponse(unit));
    this.metadata = meta;
  }
}
