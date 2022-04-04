import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationEntity, ConversationMemberEntity, MessageEntity } from "entities/social/conversation.entity";
import { AuthModule } from "modules/auth/auth.module";
import { ChatGateway } from "./adapters/in/chat.gateway";
import { ConversationController } from "./adapters/in/conversation.controller";
import { ConversationRepository } from "./adapters/out/conversation.repository";
import { MessageRepository } from "./adapters/out/message.repository";
import { WsMiddlewareFactory } from "./adapters/out/wsMiddlewareFactory.service";
import { ChatConnectCommandHandler } from "./usecases/chatConnect";
import { ChatDisconnectCommandHandler } from "./usecases/chatDisconnect";
import { CreateConversationCommandHandler } from "./usecases/createConversation";
import { SendMessageCommandHandler } from "./usecases/sendMessages";

const commandHandlers = [
  SendMessageCommandHandler,
  ChatConnectCommandHandler,
  ChatDisconnectCommandHandler,
  CreateConversationCommandHandler
]

const repositories = [
  {
    provide: "IConversationRepository",
    useClass: ConversationRepository
  },
  {
    provide: "IMessageRepository",
    useClass: MessageRepository
  }
]

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    TypeOrmModule.forFeature([
      ConversationMemberEntity,
      ConversationEntity,
      MessageEntity
    ])
  ],
  controllers:[
    ConversationController
  ],
  providers: [
    ChatGateway,
    {
      provide: "IWsMiddlewareFactory",
      useClass: WsMiddlewareFactory
    },
    ...commandHandlers,
    ...repositories
  ],
  exports: ["IConversationRepository"]
})
export class CommunicationModule { }
