import { Module } from "@nestjs/common";
import { AuthModule } from "modules/auth/auth.module";
import { ChatGateway } from "./adapters/chat.gateway";

@Module({
  imports: [AuthModule],
  providers: [ChatGateway]
})
export class CommunicationModule {}
