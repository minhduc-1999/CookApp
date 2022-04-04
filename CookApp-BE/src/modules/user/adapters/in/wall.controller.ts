import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { FollowCommand } from "modules/user/useCases/follow";
import { FollowResponse } from "modules/user/useCases/follow/followResponse";
import { GetAlbumsQuery } from "modules/user/useCases/getAlbums";
import { GetAlbumsResponse } from "modules/user/useCases/getAlbums/getAlbumResponse";
import { GetAlbumsRequest } from "modules/user/useCases/getAlbums/getWallPostsRequest";
import { GetWallQuery } from "modules/user/useCases/getWall";
import { GetWallResponse } from "modules/user/useCases/getWall/getWallResponse";
import { GetWallPostsQuery } from "modules/user/useCases/getWallPosts";
import { GetWallPostsRequest } from "modules/user/useCases/getWallPosts/getWallPostsRequest";
import { GetWallPostsResponse } from "modules/user/useCases/getWallPosts/getWallPostsResponse";
import { UnfolllowCommand } from "modules/user/useCases/unfollow";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("users/:id/walls")
@ApiTags("User/Wall")
@ApiBearerAuth()
export class WallController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @Get("posts")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetWallPostsResponse, "Get wall's posts successfully")
  async getWallPosts(
    @Query(new ParseHttpRequestPipe<typeof GetWallPostsRequest>()) query: GetWallPostsRequest,
    @HttpUserReq() user: User,
    @Param("id", ParseUUIDPipe) targetId: string
  ): Promise<Result<GetWallPostsResponse>> {
    const postsQuery = new GetWallPostsQuery(user, targetId, query);
    const result = await this._queryBus.execute(postsQuery);
    return Result.ok(result, {
      messages: ["Get wall's posts successfully"],
    });
  }

  @Get("albums")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(
    GetAlbumsResponse,
    "Get albums successfully"
  )
  async getAlbums(
    @Query(new ParseHttpRequestPipe<typeof GetAlbumsRequest>()) query: GetAlbumsRequest,
    @Param("id", ParseUUIDPipe) targetId: string,
    @HttpUserReq() user: User
  ): Promise<Result<GetAlbumsResponse>> {
    query.targetId = targetId
    const getAlbumsQuery = new GetAlbumsQuery(user, query);
    const result = await this._queryBus.execute(getAlbumsQuery);
    return Result.ok(result, {
      messages: ["Get album successfully"],
    });
  }

  @Post("followers")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(FollowResponse, "Follow successfully")
  @HttpRequestTransaction()
  async follow(
    @Param("id", ParseUUIDPipe) targetId: string,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<FollowResponse>> {
    const command = new FollowCommand(user, targetId, tx);
    const result = await this._commandBus.execute(command);
    return Result.ok(result, {
      messages: ["Follow successfully"],
    });
  }

  @Delete("followers")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(UnfolllowCommand, "Unfollow successfully")
  @HttpRequestTransaction()
  async unfollow(
    @Param("id", ParseUUIDPipe) targetId: string,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<UnfolllowCommand>> {
    const command = new UnfolllowCommand(user, targetId, tx);
    const result = await this._commandBus.execute(command);
    return Result.ok(result, {
      messages: ["Unfollow successfully"],
    });
  }

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetWallResponse, "Get wall information successfully")
  async getWall(
    @Param("id", ParseUUIDPipe) targetId: string,
    @HttpUserReq() user: User
  ) {
    const query = new GetWallQuery(user, targetId);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, {
      messages: ["Get wall information successfully"],
    });
  }
}
