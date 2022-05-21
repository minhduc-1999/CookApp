import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
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
import { ChooseInterestsCommand } from "modules/user/useCases/chooseInterests";
import { ChooseInterestsRequest } from "modules/user/useCases/chooseInterests/chooseInterestsRequest";
import { ChooseInterestsResponse } from "modules/user/useCases/chooseInterests/chooseInterestsResponse";
import { CreateTopicCommand } from "modules/user/useCases/createTopic";
import { CreateTopicRequest } from "modules/user/useCases/createTopic/createTopicRequest";
import { CreateTopicResponse } from "modules/user/useCases/createTopic/createTopicResponse";
import { GetInterestedTopicsQuery } from "modules/user/useCases/getInterestedTopics";
import { GetInterestedTopicsResponse } from "modules/user/useCases/getInterestedTopics/getInterestedTopicsResponse";
import { GetTopicsQuery } from "modules/user/useCases/getTopics";
import { GetTopicsRequest } from "modules/user/useCases/getTopics/getTopicsRequest";
import { GetTopicsResponse } from "modules/user/useCases/getTopics/getTopicsResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("topics")
@ApiTags("Topics")
@ApiBearerAuth()
@RequirePermissions("manage_topic")
export class TopicController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetTopicsResponse, "Get topics successfully")
  @RequirePermissions("read_topic")
  async getTopics(
    @Query(new ParseHttpRequestPipe<typeof GetTopicsRequest>())
    query: GetTopicsRequest,
    @HttpUserReq() user: User
  ): Promise<Result<GetTopicsResponse>> {
    const getTopicsQuery = new GetTopicsQuery(user, query);
    const result = await this._queryBus.execute(getTopicsQuery);
    return Result.ok(result, {
      messages: ["Get topics successfully"],
    });
  }

  @Get("interested")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetInterestedTopicsResponse, "Get topics successfully")
  @RequirePermissions("read_topic")
  async getInterestedTopics(
    @HttpUserReq() user: User
  ): Promise<Result<GetInterestedTopicsResponse>> {
    const query = new GetInterestedTopicsQuery(user);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, {
      messages: ["Get topics successfully"],
    });
  }

  @Put("interests")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(ChooseInterestsResponse, "Successfully")
  @HttpRequestTransaction()
  @RequirePermissions("read_topic")
  async chooseInterests(
    @Body() body: ChooseInterestsRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const editAlbumCommand = new ChooseInterestsCommand(tx, user, body);
    const res = await this._commandBus.execute(editAlbumCommand);
    return Result.ok(res, { messages: ["Successfully"] });
  }

  @Post()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustomWithoutData("Create topic successfully")
  @HttpRequestTransaction()
  @RequirePermissions("create_topic")
  async createTopic(
    @Body() topicBody: CreateTopicRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<CreateTopicResponse>> {
    const createTopicCommand = new CreateTopicCommand(user, topicBody, tx);
    const createdTopic = await this._commandBus.execute(createTopicCommand);
    return Result.ok(createdTopic, { messages: ["Create topic successfully"] });
  }
}
