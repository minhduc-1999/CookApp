import { Body, Controller, Get, MessageEvent, Post, Req, Sse } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { MessageResponse } from "base/dtos/response.dto";
import { Result } from "base/result.base";
import { ApiCreatedResponseCustom, ApiFailResponseCustom, ApiOKResponseCustom } from "decorators/apiSuccessResponse.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { ChatEventType } from "modules/communication/events/eventType";
import { GetChatStatusQuery } from "modules/communication/usecases/getChatStatus";
import { GetChatStatusResponse } from "modules/communication/usecases/getChatStatus/getChatStatusResponse";
import { SendMessageCommand } from "modules/communication/usecases/sendMessages";
import { SendMessageRequest } from "modules/communication/usecases/sendMessages/sendMessageRequest";
import { SendMessageResponse } from "modules/communication/usecases/sendMessages/sendMessageResponse";
import { TransmitMessagesQuery } from "modules/communication/usecases/transmitMessages";
import { from, map, mergeMap, Observable } from "rxjs";
import { Request } from "express"

@Controller("messages")
@ApiTags("User/Chat")
@ApiBearerAuth()
export class MessageController {
  constructor(
    private _queryBus: QueryBus,
    private _commandBus: CommandBus,
  ) { }

  @Get("status")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(GetChatStatusResponse, "Get status successfully")
  async getConversation(
    @HttpUserReq() user: User
  ): Promise<Result<GetChatStatusResponse>> {
    const query = new GetChatStatusQuery(user);
    const res = await this._queryBus.execute(query);
    return Result.ok(res, { messages: ["Get status successfully"] });
  }

  @Post()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(SendMessageResponse, "Send message successfully")
  @HttpRequestTransaction()
  async sendMessage(
    @Body() body: SendMessageRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<SendMessageResponse>> {
    const command = new SendMessageCommand(user, body, tx);
    const result = await this._commandBus.execute(command);
    return Result.ok(result, {
      messages: ["Send message successfully"],
    });
  }

  @Sse("sse")
  getMessages(
    @HttpUserReq() user: User,
  ): Observable<MessageEvent> {
    const query = new TransmitMessagesQuery(user)

    const obs = from(this._queryBus.execute(query) as Promise<Observable<MessageResponse>>)

    return obs.pipe(
      mergeMap(ob => ob.pipe(
        map(msgRes => {
          return {
            data: msgRes,
            type: ChatEventType.OUT_MSG
          }
        })
      ))
    )
  }
}
