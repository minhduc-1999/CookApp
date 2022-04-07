import { Body, Controller, MessageEvent, Post, Sse } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { MessageResponse } from "base/dtos/response.dto";
import { Result } from "base/result.base";
import { ApiFailResponseCustom, ApiOKResponseCustom } from "decorators/apiSuccessResponse.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { ChatEventType } from "modules/communication/events/eventType";
import { SendMessageCommand } from "modules/communication/usecases/sendMessages";
import { SendMessageRequest } from "modules/communication/usecases/sendMessages/sendMessageRequest";
import { SendMessageResponse } from "modules/communication/usecases/sendMessages/sendMessageResponse";
import { TransmitMessagesQuery } from "modules/communication/usecases/transmitMessages";
import { from, map, mergeMap, Observable } from "rxjs";

@Controller("messages")
@ApiTags("User/Chat")
@ApiBearerAuth()
export class ChatController {
  constructor(
    private _queryBus: QueryBus,
    private _commandBus: CommandBus,
  ) { }

  @Post()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(SendMessageResponse, "Send message successfully")
  @HttpRequestTransaction()
  async sendMessage(
    @Body() body: SendMessageRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<SendMessageResponse>> {
    const commentsQuery = new SendMessageCommand(user, body, tx);
    const result = await this._commandBus.execute(commentsQuery);
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
