import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { WsException } from "@nestjs/websockets";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { MessageResponse } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IMessageRepository } from "modules/communication/adapters/out/message.repository";
import { NewMessageEvent } from "modules/communication/events/eventType";
import { SendMessageRequest } from "./sendMessageRequest";

export class SendMessageCommand extends BaseCommand {
  commentReq: SendMessageRequest;
  constructor(
    user: User,
    request: SendMessageRequest,
    tx: ITransaction
  ) {
    super(tx, user);
    this.commentReq = request;
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
    private _eventBus: EventBus
  ) { }
  async execute(command: SendMessageCommand): Promise<MessageResponse> {
    const { user, commentReq, tx } = command

    //Check conversation existed
    const conversation = await this._convRepo.findById(commentReq.to)

    if (!conversation) {
      throw new WsException("Conversation not found")
    }

    //Check if user in conversation
    const isMember = await this._convRepo.isMember(conversation.id, user.id)

    if (!isMember) {
      throw new WsException("Not in conversation")
    }

    //Send message
    const msg = user.inbox(conversation, commentReq.message, commentReq.type)
    const result = await this._msgRepo.setTransaction(tx).createMessage(msg)
    result.sender = user
    this._eventBus.publish(new NewMessageEvent(result))
    return new MessageResponse(result)
  }
}
