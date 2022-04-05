import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post as PostHttp, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiCreatedResponseCustom,
  ApiFailResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { CreateConversationCommand } from "modules/communication/usecases/createConversation";
import { CreateConversationRequest } from "modules/communication/usecases/createConversation/createConversationRequest";
import { CreateConversationResponse } from "modules/communication/usecases/createConversation/createConversationResponse";
import { GetMessagesQuery } from "modules/communication/usecases/getMessages";
import { GetMessagesResponse } from "modules/communication/usecases/getMessages/getMessagesResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("conversation")
@ApiTags("User/Chat")
@ApiBearerAuth()
export class ConversationController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @PostHttp()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(CreateConversationResponse, "Create conversation successfully")
  @HttpRequestTransaction()
  async createConversation(
    @Body() body: CreateConversationRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<CreateConversationResponse>> {
    const createAlbumCommand = new CreateConversationCommand(user, body, tx);
    const convRes = await this._commandBus.execute(createAlbumCommand);
    return Result.ok(convRes, { messages: ["Create conversation successfully"] });
  }

  // @Patch(":albumId")
  // @ApiFailResponseCustom()
  // @ApiCreatedResponseCustom(EditAlbumResponse, "Edit album successfully")
  // @HttpRequestTransaction()
  // @ApiNotFoundResponse({ description: "Album not found" })
  // async editPost(
  //   @Body() body: EditAlbumRequest,
  //   @HttpUserReq() user: User,
  //   @Param("albumId", ParseUUIDPipe) albumId: string,
  //   @HttpParamTransaction() tx: ITransaction
  // ): Promise<Result<EditAlbumResponse>> {
  //   body.id = albumId;
  //   const editAlbumCommand = new EditAlbumCommand(tx, user, body);
  //   const res = await this._commandBus.execute(editAlbumCommand);
  //   return Result.ok(res, { messages: ["Edit album successfully"] });
  // }

  @Get(":conversationId/messages")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(GetMessagesResponse, "Get messages successfully")
  @ApiNotFoundResponse({ description: "Conversation not found" })
  async getPostById(
    @Param("conversationId", ParseUUIDPipe) convId: string,
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>()) queryOpt: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetMessagesResponse>> {
    const query = new GetMessagesQuery(user, convId, queryOpt);
    const res = await this._queryBus.execute(query);
    return Result.ok(res, { messages: ["Get messages successfully"] });
  }
}
