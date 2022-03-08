import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { WebSocketAuthGuard } from "guards/websocketAuth.guard";
import { Socket } from "socket.io";
import { Server } from "ws";

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origins: ["locahost:8080"],
    credentials: true,
  } 
})

// @UseGuards(WebSocketAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  async handleDisconnect(client: Socket) {
    console.log("disconneted: ", client.id)
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log("Connect: ", client.id)
  }

  @SubscribeMessage("message")
  async handleMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket : Socket
  ): Promise<void> {
    console.log("received message: ", body)
    socket.emit("message", "response " + body)
  }
}
