import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationEntity, ConversationMemberEntity } from "entities/social/conversation.entity";
import { MessageEntity } from "entities/social/message.entity";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { AuthModule } from "modules/auth/auth.module";
import { ShareModule } from "modules/share/share.module";
import { ChatController } from "./adapters/in/chat.controller";
import { ConversationController } from "./adapters/in/conversation.controller";
import { ConversationRepository } from "./adapters/out/conversation.repository";
import { MessageRepository } from "./adapters/out/message.repository";
import { WsMiddlewareFactory } from "./adapters/out/wsMiddlewareFactory.service";
import { ChatConnectCommandHandler } from "./usecases/chatConnect";
import { ChatDisconnectCommandHandler } from "./usecases/chatDisconnect";
import { CreateConversationCommandHandler } from "./usecases/createConversation";
import { GetMessagesQueryHandler } from "./usecases/getMessages";
import { SendMessageCommandHandler } from "./usecases/sendMessages";
import { TransmitMessagesQueryHandler } from "./usecases/transmitMessages";

const commandHandlers = [
  SendMessageCommandHandler,
  ChatConnectCommandHandler,
  ChatDisconnectCommandHandler,
  CreateConversationCommandHandler
]

const queryHandlers = [
  GetMessagesQueryHandler,
  TransmitMessagesQueryHandler
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
    ]),
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
  ],
  controllers: [
    ConversationController,
    ChatController
  ],
  providers: [
    {
      provide: "IWsMiddlewareFactory",
      useClass: WsMiddlewareFactory
    },
    ...commandHandlers,
    ...repositories,
    ...queryHandlers
  ],
  exports: ["IConversationRepository"]
})
export class CommunicationModule { }
