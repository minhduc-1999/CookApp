import { Inject, UseFilters, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { MessageResponse } from "base/dtos/response.dto";
import { WsParamTransaction, WsRequestTransaction } from "decorators/transaction.decorator";
import { WsUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { WsExceptionFilter } from "exception_filter/wsException.filter";
import { WebSocketAuthGuard } from "guards/websocketAuth.guard";
import { ChatEventType } from "modules/communication/events/eventType";
import { ChatConnectCommand } from "modules/communication/usecases/chatConnect";
import { ChatDiconnectCommand } from "modules/communication/usecases/chatDisconnect";
import { SendMessageCommand } from "modules/communication/usecases/sendMessages";
import { SendMessageRequest } from "modules/communication/usecases/sendMessages/sendMessageRequest";
import { ParseWsRequestPipe } from "pipes/parseRequest.pipe";
import { Socket, Server } from "socket.io";
import { IWsMiddlewareFactory } from "../out/wsMiddlewareFactory.service";

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origins: ["locahost:8080"],
    credentials: true,
  }
})

@UseGuards(WebSocketAuthGuard)
@UseFilters(WsExceptionFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    @Inject("IWsMiddlewareFactory")
    private _wsMiddlewareFactory: IWsMiddlewareFactory,
    private _commandBus: CommandBus
  ) { }

  afterInit(server: Server) {
    server.use(this._wsMiddlewareFactory.useAuth())
  }
  @WebSocketServer()
  server: Server

  async handleDisconnect(client: Socket) {
    console.log("disconneted: ", client.id)
    const user = client.handshake.auth.user as User
    const command = new ChatDiconnectCommand(user)
    this._commandBus.execute(command)
  }


  async handleConnection(client: Socket,
  ) {
    console.log("connect", client.id)
    const user = client.handshake.auth.user as User
    const command = new ChatConnectCommand(user, client.id)
    this._commandBus.execute(command)
  }

  @WsRequestTransaction()
  @SubscribeMessage(ChatEventType.IN_MESSAGE)
  async handleMessage(
    @MessageBody(new ParseWsRequestPipe<typeof SendMessageRequest>()) body: SendMessageRequest,
    @ConnectedSocket() socket: Socket,
    @WsParamTransaction() tx: ITransaction,
    @WsUserReq() user: User
  ): Promise<void> {
    const command = new SendMessageCommand(user, body, tx)
    const [msg, onlineUsers] = (await this._commandBus.execute(command)) as [MessageResponse, User[]]
    onlineUsers.forEach(user => {
      socket.to(user.status).emit(ChatEventType.OUT_MSG, msg)
    })
  }
}
