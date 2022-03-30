import { Inject, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { WsParamTransaction, WsRequestTransaction } from "decorators/transaction.decorator";
import { User } from "domains/social/user.domain";
import { WebSocketAuthGuard } from "guards/websocketAuth.guard";
import { ChatConnectCommand } from "modules/communication/usecases/chatConnect";
import { ChatDiconnectCommand } from "modules/communication/usecases/chatDisconnect";
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
  @SubscribeMessage("chat:send")
  async handleMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
    @WsParamTransaction() tx: ITransaction
  ): Promise<void> {
    console.log("received message: ", body, tx)
    if (body.room)
      socket.broadcast.to(body.room).emit("chat:message", body.message)
    else
      socket.broadcast.emit("chat:message", body.message)
  }

  @SubscribeMessage("chat:join")
  async joinConversation(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket
  ): Promise<string> {
    console.log("join: ", body)
    socket.join(body)
    return "join room success"
  }
}
