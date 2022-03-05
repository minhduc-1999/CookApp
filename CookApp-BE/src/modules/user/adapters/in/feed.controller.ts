import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";
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
import { GetFeedPostsQuery } from "modules/user/useCases/getFeedPosts";
import { GetFeedPostsResponse } from "modules/user/useCases/getFeedPosts/getFeedPostsResponse";
import { ParseRequestPipe } from "pipes/parseRequest.pipe";

@Controller("users/feeds")
@ApiTags("User/Feed")
@ApiBearerAuth()
export class FeedController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get('posts')
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(
    GetFeedPostsResponse,
    "Get feed's posts successfully"
  )
  async getFeedPosts(
    @Query(new ParseRequestPipe<typeof PageOptionsDto>()) query: PageOptionsDto,
    @UserReq() user: User
  ): Promise<Result<GetFeedPostsResponse>> {
    const postsQuery = new GetFeedPostsQuery(user, query);
    const result = await this._queryBus.execute(postsQuery);
    return Result.ok(result, {
      messages: ["Get feed's posts successfully"],
    });
  }
}
