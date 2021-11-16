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
import { UserDTO } from "dtos/user.dto";
import { GetWallPostsQuery } from "modules/user/useCases/getWallPosts";
import { GetWallPostsResponse } from "modules/user/useCases/getWallPosts/getWallPostsResponse";
import { ParsePaginationPipe } from "pipes/parsePagination.pipe";

@Controller("users/walls")
@ApiTags("User/Wall")
@ApiBearerAuth()
export class WallController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get('posts')
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(
    GetWallPostsResponse,
    "Get wall's posts successfully"
  )
  async getWallPosts(
    @Query(ParsePaginationPipe) query: PageOptionsDto,
    @User() user: UserDTO
  ): Promise<Result<GetWallPostsResponse>> {
    const postsQuery = new GetWallPostsQuery(user, query);
    const result = await this._queryBus.execute(postsQuery);
    return Result.ok(result, {
      messages: ["Get wall's posts successfully"],
    });
  }
}
