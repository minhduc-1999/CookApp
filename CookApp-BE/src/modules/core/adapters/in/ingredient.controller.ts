import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustomWithoutData,
  ApiFailResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
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
import { DeleteIngredientCommand } from "modules/core/useCases/deleteIngredient";
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
  ): Promise<Result<GetIngredientsResponse>> {
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
  @RequirePermissions("create_ingredient")
  async createIngredient(
    @Body() req: CreateIngredientRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<string>> {
    const createIngredientCommand = new CreateIngredientCommand(user, req, tx);
    const newId = await this._commandBus.execute(createIngredientCommand);
    return Result.ok(newId, {
      messages: ["Create ingredient successfully"],
    });
  }

  @Delete(":ingredientId")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Delete ingredient successfully")
  @HttpRequestTransaction()
  async deleteIngredient(
    @HttpUserReq() user: User,
    @Param("ingredientId", ParseUUIDPipe) ingredientId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const command = new DeleteIngredientCommand(user, tx, ingredientId);
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Delete ingredient successfully"] });
  }
}
