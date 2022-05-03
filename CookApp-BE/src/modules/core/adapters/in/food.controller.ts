import {
  Body,
  Controller,
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
import {
  HttpParamTransaction,
  HttpRequestTransaction,
} from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { CreateFoodCommand } from "modules/core/useCases/createFood";
import { CreateFoodRequest } from "modules/core/useCases/createFood/createFoodRequest";
import { CreateFoodResponse } from "modules/core/useCases/createFood/createFoodResponse";
import { EditVoteCommand } from "modules/core/useCases/editVote";
import { EditVoteRequest } from "modules/core/useCases/editVote/editVoteRequest";
import { GetFoodDetailQuery } from "modules/core/useCases/getFoodDetail";
import { GetFoodDetailResponse } from "modules/core/useCases/getFoodDetail/getFoodDetailResponse";
import { GetFoodsQuery } from "modules/core/useCases/getFoods";
import { GetFoodsResponse } from "modules/core/useCases/getFoods/getFoodsResponse";
import { GetFoodVotesQuery } from "modules/core/useCases/getFoodVotes";
import { GetFoodVotesResponse } from "modules/core/useCases/getFoodVotes/getFoodVotesResponse";
import { GetVoteQuery } from "modules/core/useCases/getVote";
import { GetVoteResponse } from "modules/core/useCases/getVote/getVoteResponse";
import { VoteFoodCommand } from "modules/core/useCases/voteFood";
import { VoteFoodRequest } from "modules/core/useCases/voteFood/voteFoodRequest";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("foods")
@ApiTags("Foods")
@ApiBearerAuth()
export class FoodController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodsResponse, "Get foods successfully")
  async getFoods(
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

  @Get(":foodId/vote")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetVoteQuery, "Get food vote successfully")
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

  @Post()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(CreateFoodResponse, "Create food successfully")
  @HttpRequestTransaction()
  async createPost(
    @Body() req: CreateFoodRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<string>> {
    const createPostCommand = new CreateFoodCommand(user, req, tx);
    const newFoodId = await this._commandBus.execute(createPostCommand);
    return Result.ok(newFoodId, { messages: ["Create food successfully"] });
  }

  @Post(":foodId/ratings")
  @ApiFailResponseCustom()
  @ApiOKResponseCustomWithoutData("Vote food successfully")
  @HttpRequestTransaction()
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
}
