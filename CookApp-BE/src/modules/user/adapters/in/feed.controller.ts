import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { RequirePermissions } from "decorators/roles.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetFeedPostsQuery } from "modules/user/useCases/getFeedPosts";
import { GetFeedPostsRequest } from "modules/user/useCases/getFeedPosts/getFeedPostsRequest";
import { GetFeedPostsResponse } from "modules/user/useCases/getFeedPosts/getFeedPostsResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("users/feeds")
@ApiTags("User/Feed")
@ApiBearerAuth()
@RequirePermissions("manage_post")
export class FeedController {
  constructor(private _queryBus: QueryBus) {}

  @Get('posts')
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(
    GetFeedPostsResponse,
    "Get feed's posts successfully"
  )
  @RequirePermissions("read_post")
  async getFeedPosts(
    @Query(new ParseHttpRequestPipe<typeof GetFeedPostsRequest>()) query: GetFeedPostsRequest,
    @HttpUserReq() user: User
  ): Promise<Result<GetFeedPostsResponse>> {
    const postsQuery = new GetFeedPostsQuery(user, query);
    const result = await this._queryBus.execute(postsQuery);
    return Result.ok(result, {
      messages: ["Get feed's posts successfully"],
    });
  }
}
