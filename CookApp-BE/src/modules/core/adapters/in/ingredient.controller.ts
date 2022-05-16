import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustomWithoutData,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { RequirePermissions } from "decorators/roles.decorator";
import {
  HttpParamTransaction,
  HttpRequestTransaction,
} from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { CreateIngredientCommand } from "modules/core/useCases/createIngredient";
import { CreateIngredientRequest } from "modules/core/useCases/createIngredient/createIngredientRequest";
import { GetFoodsResponse } from "modules/core/useCases/getFoods/getFoodsResponse";
import { GetIngredientsQuery } from "modules/core/useCases/getIngredients";
import { GetIngredientsResponse } from "modules/core/useCases/getIngredients/getIngredientsResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("ingredients")
@ApiTags("Ingredients")
@ApiBearerAuth()
@RequirePermissions("manage_ingredient")
export class IngredientController {
  constructor(private _queryBus: QueryBus, private _commandBus: CommandBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetIngredientsResponse, "Get ingredients successfully")
  @RequirePermissions("read_ingredient")
  async getIngredients(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetFoodsResponse>> {
    const ingredientsQuery = new GetIngredientsQuery(user, query);
    const result = await this._queryBus.execute(ingredientsQuery);
    return Result.ok(result, {
      messages: ["Get ingredients successfully"],
    });
  }

  @ApiFailResponseCustom()
  @HttpRequestTransaction()
  @ApiCreatedResponseCustomWithoutData("Create ingredient successfully")
  @Post()
  async createIngredient(
    @Body() req: CreateIngredientRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<string>> {
    const createIngredientCommand = new CreateIngredientCommand(user, req, tx);
    const newFoodId = await this._commandBus.execute(createIngredientCommand);
    return Result.ok(newFoodId, {
      messages: ["Create ingredient successfully"],
    });
  }
}
