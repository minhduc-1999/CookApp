import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "modules/auth/auth.module";
import { ChatGateway } from "./adapters/in/chat.gateway";
import { WsMiddlewareFactory } from "./adapters/out/wsMiddlewareFactory.service";
import { ConversationModelDefinition, MessageBucketDefinition } from "./entities/chat.entity";
import { ChatConnectCommandHandler } from "./usecases/chatConnect";
import { ChatDisconnectCommandHandler } from "./usecases/chatDisconnect";
import { SendMessageCommandHandler } from "./usecases/sendMessages";

const commandHandlers = [
  SendMessageCommandHandler,
  ChatConnectCommandHandler,
  ChatDisconnectCommandHandler
]

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    MongooseModule.forFeature([
      ConversationModelDefinition,
      MessageBucketDefinition
    ])
  ],
  providers: [
    ChatGateway,
    {
      provide: "IWsMiddlewareFactory",
      useClass: WsMiddlewareFactory
    },
    ...commandHandlers
  ]
})
export class CommunicationModule { }
