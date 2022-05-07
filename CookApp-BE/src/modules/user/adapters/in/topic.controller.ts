import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import {
  HttpParamTransaction,
  HttpRequestTransaction,
} from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { ChooseInterestsCommand } from "modules/user/useCases/chooseInterests";
import { ChooseInterestsRequest } from "modules/user/useCases/chooseInterests/chooseInterestsRequest";
import { ChooseInterestsResponse } from "modules/user/useCases/chooseInterests/chooseInterestsResponse";
import { GetTopicsQuery } from "modules/user/useCases/getTopics";
import { GetTopicsRequest } from "modules/user/useCases/getTopics/getTopicsRequest";
import { GetTopicsResponse } from "modules/user/useCases/getTopics/getTopicsResponse";
import { GetWallPostsResponse } from "modules/user/useCases/getWallPosts/getWallPostsResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("topics")
@ApiTags("Topics")
@ApiBearerAuth()
export class TopicController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetTopicsResponse, "Get topics successfully")
  async getTopics(
    @Query(new ParseHttpRequestPipe<typeof GetTopicsRequest>())
    query: GetTopicsRequest,
    @HttpUserReq() user: User
  ): Promise<Result<GetWallPostsResponse>> {
    const postsQuery = new GetTopicsQuery(user, query);
    const result = await this._queryBus.execute(postsQuery);
    return Result.ok(result, {
      messages: ["Get topics successfully"],
    });
  }

  @Put("interests")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(ChooseInterestsResponse, "Successfully")
  @HttpRequestTransaction()
  async chooseInterests(
    @Body() body: ChooseInterestsRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const editAlbumCommand = new ChooseInterestsCommand(tx, user, body);
    const res = await this._commandBus.execute(editAlbumCommand);
    return Result.ok(res, { messages: ["Successfully"] });
  }
}
