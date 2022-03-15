import { Inject, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { WebSocketAuthGuard } from "guards/websocketAuth.guard";
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
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log("Connect: ", client.id)
  }

  @SubscribeMessage("chat:send")
  async handleMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    console.log("received message: ", body)
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
