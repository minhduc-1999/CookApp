import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthModule } from "modules/auth/auth.module";
import { ChatGateway } from "./adapters/in/chat.gateway";
import { WsMiddlewareFactory } from "./adapters/out/wsMiddlewareFactory.service";

@Module({
  imports: [AuthModule, CqrsModule],
  providers: [ChatGateway,
    {
      provide: "IWsMiddlewareFactory",
      useClass: WsMiddlewareFactory
    }
  ]
})
export class CommunicationModule { }
