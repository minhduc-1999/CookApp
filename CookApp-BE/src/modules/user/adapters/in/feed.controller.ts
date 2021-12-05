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
} from "decorators/ApiSuccessResponse.decorator";
import { User } from "decorators/user.decorator";
import { UserDTO } from "dtos/social/user.dto";
import { GetFeedPostsQuery } from "modules/user/useCases/getFeedPosts";
import { GetFeedPostsResponse } from "modules/user/useCases/getFeedPosts/getFeedPostsResponse";
import { ParsePaginationPipe } from "pipes/parsePagination.pipe";

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
    @Query(ParsePaginationPipe) query: PageOptionsDto,
    @User() user: UserDTO
  ): Promise<Result<GetFeedPostsResponse>> {
    const postsQuery = new GetFeedPostsQuery(user, query);
    const result = await this._queryBus.execute(postsQuery);
    return Result.ok(result, {
      messages: ["Get feed's posts successfully"],
    });
  }
}
