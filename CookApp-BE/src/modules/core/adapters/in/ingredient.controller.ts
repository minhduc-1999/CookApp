import { Controller, Get, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetFoodsResponse } from "modules/core/useCases/getFoods/getFoodsResponse";
import { GetIngredientsQuery } from "modules/core/useCases/getIngredients";
import { GetIngredientsResponse } from "modules/core/useCases/getIngredients/getIngredientsResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("ingredients")
@ApiTags("Ingredients")
@ApiBearerAuth()
export class IngredientController {
  constructor(private _queryBus: QueryBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetIngredientsResponse, "Get ingredients successfully")
  async getIngredients(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetFoodsResponse>> {
    const unitsQuery = new GetIngredientsQuery(user, query);
    const result = await this._queryBus.execute(unitsQuery);
    return Result.ok(result, {
      messages: ["Get ingredients successfully"],
    });
  }
}
