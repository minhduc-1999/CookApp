import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Message } from "domains/social/conversation.domain";
import * as Ably from "ably";
import { ConfigService } from "nestjs-config";
import { MessageResponse } from "base/dtos/response.dto";

export interface IRealtimeService {
  publishNewMessage(msg: Message): Promise<void>;
}

const ChannelType = {
  communication: "communication",
};

const MessageType = {
  newMessage: "new-message",
};

@Injectable()
export class RealtimeService
  implements IRealtimeService, OnModuleInit, OnModuleDestroy
{
  private _logger = new Logger(RealtimeService.name);
  private _realtimeClient: Ably.Realtime;

  constructor(private _configService: ConfigService) {}

  onModuleDestroy() {
    this._realtimeClient.connection.close();
    this._realtimeClient.connection.on("closed", () => {
      this._logger.log("Disconnected from Ably");
    });
  }

  onModuleInit() {
    const key = this._configService.get("realtime.key");
    this._realtimeClient = new Ably.Realtime(key);
    this._realtimeClient.connection.on("connected", () => {
      this._logger.log("Connected to Ably");
    });
  }

  async publishNewMessage(msg: Message): Promise<void> {
    const channel = this._realtimeClient.channels.get(
      ChannelType.communication
    );
    const msgResult = new MessageResponse(msg);
    channel.publish(MessageType.newMessage, msgResult);
  }
}
