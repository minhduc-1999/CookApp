import { Body, Controller, Post as PostHttp } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { UserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { CreateAlbumCommand } from "modules/user/useCases/createAlbum";
import { CreateAlbumRequest } from "modules/user/useCases/createAlbum/createAlbumRequest";
import { CreateAlbumResponse } from "modules/user/useCases/createAlbum/createAlbumResponse";

@Controller("users/albums")
@ApiTags("User/Album")
@ApiBearerAuth()
export class AlbumController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @PostHttp()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(CreateAlbumResponse, "Create album successfully")
  @HttpRequestTransaction()
  async createPost(
    @Body() body: CreateAlbumRequest,
    @UserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<CreateAlbumResponse>> {
    const createAlbumCommand = new CreateAlbumCommand(user, body, tx);
    const createdAlbum = await this._commandBus.execute(createAlbumCommand);
    return Result.ok(createdAlbum, { messages: ["Create album successfully"] });
  }

}
