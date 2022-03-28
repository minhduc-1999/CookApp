import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { UserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetFoodDetailQuery } from "modules/core/useCases/getFoodDetail";
import { GetFoodDetailResponse } from "modules/core/useCases/getFoodDetail/getFoodDetailResponse";
import { GetFoodsQuery } from "modules/core/useCases/getFoods";
import { GetFoodsResponse } from "modules/core/useCases/getFoods/getFoodsResponse";
import { ParseRequestPipe } from "pipes/parseRequest.pipe";

@Controller("foods")
@ApiTags("Foods")
@ApiBearerAuth()
export class FoodController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodsResponse, "Get foods successfully")
  async getFoods(
    @Query(new ParseRequestPipe<typeof PageOptionsDto>()) query: PageOptionsDto,
    @UserReq() user: User
  ): Promise<Result<GetFoodsResponse>> {
    const foodQuery = new GetFoodsQuery(user, query);
    const result = await this._queryBus.execute(foodQuery);
    return Result.ok(result, {
      messages: ["Get foods successfully"],
    });
  }

  @Get(":foodId")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodDetailResponse, "Get food successfully")
  async getFoodDetail(
    @UserReq() user: User,
    @Param("foodId", ParseUUIDPipe) foodId: string
  ): Promise<Result<GetFoodDetailResponse>> {
    const foodQuery = new GetFoodDetailQuery(user, foodId);
    const result = await this._queryBus.execute(foodQuery);
    return Result.ok(result, {
      messages: ["Get food successfully"],
    });
  }
}
