import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
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
import { ConfirmFoodCommand } from "modules/core/useCases/confirmFood";
import { ConfirmFoodRequest } from "modules/core/useCases/confirmFood/confirmFoodRequest";
import { CreateFoodCommand } from "modules/core/useCases/createFood";
import { CreateFoodRequest } from "modules/core/useCases/createFood/createFoodRequest";
import { CreateFoodResponse } from "modules/core/useCases/createFood/createFoodResponse";
import { DeleteFoodCommand } from "modules/core/useCases/deleteFood";
import { DeleteFoodSaveCommand } from "modules/core/useCases/deleteFoodSave";
import { EditVoteCommand } from "modules/core/useCases/editVote";
import { EditVoteRequest } from "modules/core/useCases/editVote/editVoteRequest";
import { GetFoodDetailQuery } from "modules/core/useCases/getFoodDetail";
import { GetFoodDetailResponse } from "modules/core/useCases/getFoodDetail/getFoodDetailResponse";
import { GetFoodsQuery } from "modules/core/useCases/getFoods";
import { GetFoodsResponse } from "modules/core/useCases/getFoods/getFoodsResponse";
import { GetFoodSavesQuery } from "modules/core/useCases/getFoodSaves";
import { GetFoodSavesRequest } from "modules/core/useCases/getFoodSaves/getFoodSavesRequest";
import { GetFoodSavesResponse } from "modules/core/useCases/getFoodSaves/getFoodSavesResponse";
import { GetFoodVotesQuery } from "modules/core/useCases/getFoodVotes";
import { GetFoodVotesResponse } from "modules/core/useCases/getFoodVotes/getFoodVotesResponse";
import { GetUncensoredFoodsQuery } from "modules/core/useCases/getUncensoredFoods";
import { GetVoteQuery } from "modules/core/useCases/getVote";
import { GetVoteResponse } from "modules/core/useCases/getVote/getVoteResponse";
import { SaveFoodCommand } from "modules/core/useCases/saveFood";
import { SaveFoodRequest } from "modules/core/useCases/saveFood/saveFoodRequest";
import { VoteFoodCommand } from "modules/core/useCases/voteFood";
import { VoteFoodRequest } from "modules/core/useCases/voteFood/voteFoodRequest";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("foods")
@ApiTags("Foods")
@ApiBearerAuth()
@RequirePermissions("manage_food")
export class FoodController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get("censored")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodsResponse, "Get foods successfully")
  @RequirePermissions("read_food")
  async getCensoredFoods(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetFoodsResponse>> {
    const foodQuery = new GetFoodsQuery(user, query);
    const result = await this._queryBus.execute(foodQuery);
    return Result.ok(result, {
      messages: ["Get foods successfully"],
    });
  }

  @Get("save")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodSavesResponse, "Get foods successfully")
  @RequirePermissions("read_food")
  async getFoodSaves(
    @Query(new ParseHttpRequestPipe<typeof GetFoodSavesRequest>())
    query: GetFoodSavesRequest,
    @HttpUserReq() user: User
  ): Promise<Result<GetFoodsResponse>> {
    const foodSavesQuery = new GetFoodSavesQuery(user, query);
    const result = await this._queryBus.execute(foodSavesQuery);
    return Result.ok(result, {
      messages: ["Get foods successfully"],
    });
  }

  @Get("uncensored")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodsResponse, "Get foods successfully")
  @RequirePermissions("censor_food")
  async getUnCensoredFoods(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetFoodsResponse>> {
    const foodQuery = new GetUncensoredFoodsQuery(user, query);
    const result = await this._queryBus.execute(foodQuery);
    return Result.ok(result, {
      messages: ["Get foods successfully"],
    });
  }

  @Get(":foodId/vote")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetVoteQuery, "Get food vote successfully")
  @RequirePermissions("read_food")
  async getVote(
    @Param("foodId", ParseUUIDPipe) foodId: string,
    @HttpUserReq() user: User
  ): Promise<Result<GetVoteResponse>> {
    const getVoteQuery = new GetVoteQuery(user, foodId);
    const result = await this._queryBus.execute(getVoteQuery);
    return Result.ok(result, {
      messages: ["Get food vote successfully"],
    });
  }

  @Get(":foodId/votes")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodVotesResponse, "Get food votes successfully")
  @RequirePermissions("read_food")
  async getFoodVotes(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @Param("foodId", ParseUUIDPipe) foodId: string,
    @HttpUserReq() user: User
  ): Promise<Result<GetFoodVotesResponse>> {
    const foodVotesQuery = new GetFoodVotesQuery(user, foodId, query);
    const result = await this._queryBus.execute(foodVotesQuery);
    return Result.ok(result, {
      messages: ["Get food votes successfully"],
    });
  }

  @Get(":foodId")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodDetailResponse, "Get food successfully")
  @RequirePermissions("read_food")
  async getFoodDetail(
    @HttpUserReq() user: User,
    @Param("foodId", ParseUUIDPipe) foodId: string
  ): Promise<Result<GetFoodDetailResponse>> {
    const foodQuery = new GetFoodDetailQuery(user, foodId);
    const result = await this._queryBus.execute(foodQuery);
    return Result.ok(result, {
      messages: ["Get food successfully"],
    });
  }

  @Patch(":foodId/censorship")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Successfully")
  @HttpRequestTransaction()
  @RequirePermissions("censor_food")
  async confirmFood(
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction,
    @Param("foodId", ParseUUIDPipe) foodId: string,
    @Body() body: ConfirmFoodRequest
  ): Promise<Result<string>> {
    body.foodId = foodId;
    const confirmFoodCommand = new ConfirmFoodCommand(tx, user, body);
    await this._commandBus.execute(confirmFoodCommand);
    return Result.ok(null, { messages: ["Successfully"] });
  }

  @Post()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(CreateFoodResponse, "Create food successfully")
  @HttpRequestTransaction()
  @RequirePermissions("create_food")
  async createFood(
    @Body() req: CreateFoodRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<string>> {
    const createFoodCommand = new CreateFoodCommand(user, req, tx);
    const newFoodId = await this._commandBus.execute(createFoodCommand);
    return Result.ok(newFoodId, { messages: ["Create food successfully"] });
  }

  @Post(":foodId/ratings")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Vote food successfully")
  @HttpRequestTransaction()
  @RequirePermissions("read_food")
  async voteFood(
    @Body() req: VoteFoodRequest,
    @HttpUserReq() user: User,
    @Param("foodId", ParseUUIDPipe) foodId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    req.foodId = foodId;
    const voteFoodCommand = new VoteFoodCommand(tx, user, req);
    await this._commandBus.execute(voteFoodCommand);
    return Result.ok(null, { messages: ["Vote food successfully"] });
  }

  @Patch(":foodId/ratings")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Edit vote successfully")
  @HttpRequestTransaction()
  @RequirePermissions("read_food")
  async editVote(
    @Body() req: EditVoteRequest,
    @HttpUserReq() user: User,
    @Param("foodId", ParseUUIDPipe) foodId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    req.foodId = foodId;
    const voteFoodCommand = new EditVoteCommand(tx, user, req);
    await this._commandBus.execute(voteFoodCommand);
    return Result.ok(null, { messages: ["Edit vote successfully"] });
  }

  @Post(":foodId/save")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Save food successfully")
  @HttpRequestTransaction()
  @RequirePermissions("read_food")
  async saveFood(
    @Body() req: SaveFoodRequest,
    @HttpUserReq() user: User,
    @Param("foodId", ParseUUIDPipe) foodId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    req.foodId = foodId;
    const saveFoodCommand = new SaveFoodCommand(tx, user, req);
    await this._commandBus.execute(saveFoodCommand);
    return Result.ok(null, { messages: ["Save food successfully"] });
  }

  @Delete(":foodId/save")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Delete food save successfully")
  @HttpRequestTransaction()
  @RequirePermissions("read_food")
  async deleteFoodSave(
    @HttpUserReq() user: User,
    @Param("foodId", ParseUUIDPipe) foodId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const deleteFoodSaveCommand = new DeleteFoodSaveCommand(tx, user, foodId);
    await this._commandBus.execute(deleteFoodSaveCommand);
    return Result.ok(null, { messages: ["Delete food save successfully"] });
  }

  @Delete(":foodId")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Delete food successfully")
  @HttpRequestTransaction()
  async deleteFood(
    @HttpUserReq() user: User,
    @Param("foodId", ParseUUIDPipe) foodId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const command = new DeleteFoodCommand(user, tx, foodId);
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Delete food successfully"] });
  }
}
