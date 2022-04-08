import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { MessageResponse, ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IMessageRepository } from "modules/communication/adapters/out/message.repository";

export class SeenMessageCommand extends BaseCommand {
  messageId: string
  conversationId: string
  constructor(
    user: User,
    msgId: string,
    convId: string,
    tx: ITransaction
  ) {
    super(tx, user);
    this.messageId = msgId,
      this.conversationId = convId
  }
}

@CommandHandler(SeenMessageCommand)
export class SeenMessageCommandHandler
  implements ICommandHandler<SeenMessageCommand>
{
  constructor(
    @Inject("IConversationRepository")
    private _convRepo: IConversationRepository,
    @Inject("IMessageRepository")
    private _msgRepo: IMessageRepository,
  ) { }
  async execute(command: SeenMessageCommand): Promise<MessageResponse> {
    const { user, messageId,conversationId, tx } = command

    //Check if user in conversation
    const isMember = await this._convRepo.isMember(conversationId, user.id)

    if (!isMember) {
      throw new ForbiddenException(ResponseDTO.fail("Not in conversation"))
    }

    //Check if msg existed
    const msg = await this._msgRepo.findById(messageId)

    if (!msg) {
      throw new NotFoundException(ResponseDTO.fail("Message not found", UserErrorCode.MESSAGE_NOT_FOUND))
    }

    await this._convRepo.setTransaction(tx).updateSeen(user.id, conversationId, msg)

    return
  }
}
