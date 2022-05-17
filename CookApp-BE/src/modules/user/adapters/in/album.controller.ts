import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post as PostHttp, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { RequirePermissions } from "decorators/roles.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { CreateAlbumCommand } from "modules/user/useCases/createAlbum";
import { CreateAlbumRequest } from "modules/user/useCases/createAlbum/createAlbumRequest";
import { CreateAlbumResponse } from "modules/user/useCases/createAlbum/createAlbumResponse";
import { EditAlbumCommand } from "modules/user/useCases/editAlbum";
import { EditAlbumRequest } from "modules/user/useCases/editAlbum/editAlbumRequest";
import { EditAlbumResponse } from "modules/user/useCases/editAlbum/editAlbumResponse";
import { GetAlbumDetailQuery } from "modules/user/useCases/getAlbumDetail";
import { GetAlbumDetailResponse } from "modules/user/useCases/getAlbumDetail/getAlbumResponse";

@Controller("users/albums")
@ApiTags("User/Album")
@ApiBearerAuth()
@RequirePermissions("manage_album")
export class AlbumController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @PostHttp()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(CreateAlbumResponse, "Create album successfully")
  @HttpRequestTransaction()
  @RequirePermissions("create_album")
  async createAlbum(
    @Body() body: CreateAlbumRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<CreateAlbumResponse>> {
    const createAlbumCommand = new CreateAlbumCommand(user, body, tx);
    const createdAlbum = await this._commandBus.execute(createAlbumCommand);
    return Result.ok(createdAlbum, { messages: ["Create album successfully"] });
  }

  @Patch(":albumId")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(EditAlbumResponse, "Edit album successfully")
  @HttpRequestTransaction()
  @ApiNotFoundResponse({ description: "Album not found" })
  @RequirePermissions("edit_album")
  async editAlbum(
    @Body() body: EditAlbumRequest,
    @HttpUserReq() user: User,
    @Param("albumId", ParseUUIDPipe) albumId: string,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<EditAlbumResponse>> {
    body.id = albumId;
    const editAlbumCommand = new EditAlbumCommand(tx, user, body);
    const res = await this._commandBus.execute(editAlbumCommand);
    return Result.ok(res, { messages: ["Edit album successfully"] });
  }

  @Get(":albumId")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(GetAlbumDetailResponse, "Get album successfully")
  @ApiNotFoundResponse({ description: "Album not found" })
  @RequirePermissions("read_album")
  async getAlbumDetail(
    @Param("albumId", ParseUUIDPipe) albumId: string,
    @HttpUserReq() user: User
  ): Promise<Result<GetAlbumDetailResponse>> {
    const query = new GetAlbumDetailQuery(user, albumId);
    const album = await this._queryBus.execute(query);
    return Result.ok(album, { messages: ["Get album successfully"] });
  }
}
