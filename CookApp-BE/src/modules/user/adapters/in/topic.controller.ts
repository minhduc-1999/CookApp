import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
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
}
