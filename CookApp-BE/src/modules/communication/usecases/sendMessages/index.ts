import {
  ForbiddenException,
  Inject,
  MethodNotAllowedException,
  NotFoundException,
} from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { Message } from "domains/social/conversation.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { ConversationType } from "enums/social.enum";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IMessageRepository } from "modules/communication/adapters/out/message.repository";
import { IRealtimeService } from "modules/communication/adapters/out/services/realtime.service";
import { NewMessageEvent } from "modules/communication/events/eventType";
import { SendMessageRequest } from "./sendMessageRequest";
import { SendMessageResponse } from "./sendMessageResponse";

export class SendMessageCommand extends BaseCommand {
  req: SendMessageRequest;
  constructor(user: User, request: SendMessageRequest, tx: ITransaction) {
    super(tx, user);
    this.req = request;
  }
}

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand>
{
  constructor(
    @Inject("IConversationRepository")
    private _convRepo: IConversationRepository,
    @Inject("IMessageRepository")
    private _msgRepo: IMessageRepository,
    private _eventBus: EventBus,
    @Inject("IRealtimeService")
    private _realtimeService: IRealtimeService
  ) {}
  async execute(command: SendMessageCommand): Promise<SendMessageResponse> {
    const { user, req, tx } = command;

    //Check conversation existed
    const conversation = await this._convRepo.findById(req.to);

    if (!conversation) {
      throw new NotFoundException(
        ResponseDTO.fail(
          "Conversation not found",
          UserErrorCode.CONVERSATION_NOT_FOUND
        )
      );
    }

    //Check if user in conversation
    const isMember = await this._convRepo.isMember(conversation.id, user.id);

    if (!isMember) {
      throw new ForbiddenException(ResponseDTO.fail("Not in conversation"));
    }

    let msg = user.inbox(conversation, req.message, req.type);

    let result: Message;

    switch (conversation.type) {
      case ConversationType.DIRECT:
        result = await this._msgRepo.setTransaction(tx).createMessage(msg);
        result.sender = user;
        this._realtimeService.publishNewMessage(result);
        this._eventBus.publish(new NewMessageEvent(result));
        return new SendMessageResponse(result);
      default:
        throw new MethodNotAllowedException();
    }
  }
}
