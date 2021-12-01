import { Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
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
import { FollowCommand } from "modules/user/useCases/follow";
import { FollowResponse } from "modules/user/useCases/follow/followResponse";
import { GetWallPostsQuery } from "modules/user/useCases/getWallPosts";
import { GetWallPostsResponse } from "modules/user/useCases/getWallPosts/getWallPostsResponse";
import { UnfolllowCommand } from "modules/user/useCases/unfollow";
import { ParseObjectIdPipe } from "pipes/parseMongoId.pipe";
import { ParsePaginationPipe } from "pipes/parsePagination.pipe";

@Controller("users/:id/walls")
@ApiTags("User/Wall")
@ApiBearerAuth()
export class WallController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get("posts")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetWallPostsResponse, "Get wall's posts successfully")
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

  @Post("followers")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(FollowResponse, "Follow successfully")
  async follow(
    @Param("id", ParseObjectIdPipe) targetId: string,
    @User() user: UserDTO
  ): Promise<Result<FollowResponse>> {
    const command = new FollowCommand(user, targetId, null);
    const result = await this._commandBus.execute(command);
    return Result.ok(result, {
      messages: ["Follow successfully"],
    });
  }

  @Delete("followers")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(UnfolllowCommand, "Unfollow successfully")
  async unfollow(
    @Param("id", ParseObjectIdPipe) targetId: string,
    @User() user: UserDTO
  ): Promise<Result<UnfolllowCommand>> {
    const command = new UnfolllowCommand(user, targetId, null);
    const result = await this._commandBus.execute(command);
    return Result.ok(result, {
      messages: ["Unfollow successfully"],
    });
  }
}
