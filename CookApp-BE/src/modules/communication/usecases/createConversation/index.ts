import { BadRequestException, ConflictException, Inject, NotAcceptableException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { CreateConversationResponse } from "./createConversationResponse";
import { CreateConversationRequest } from "./createConversationRequest";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { ResponseDTO } from "base/dtos/response.dto";
import { Conversation } from "domains/social/conversation.domain";
import { ConversationType } from "enums/social.enum";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";

export class CreateConversationCommand extends BaseCommand {
  req: CreateConversationRequest;
  constructor(user: User, req: CreateConversationRequest, tx: ITransaction) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(CreateConversationCommand)
export class CreateConversationCommandHandler
  implements ICommandHandler<CreateConversationCommand>
{
  constructor(
    @Inject("IConversationRepository")
    private _convRepo: IConversationRepository,
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
  ) { }

  async execute(command: CreateConversationCommand): Promise<CreateConversationResponse> {
    const { req, user, tx } = command;

    if (!req.members.includes(user.id)) {
      throw new BadRequestException(ResponseDTO.fail("Cannot create conversation without you"))
    }

    const existAll = await this._userRepo.existAll(req.members.filter(id => id !== user.id))

    if (!existAll) {
      throw new BadRequestException(ResponseDTO.fail("Member IDs not valid"))
    }

    let conversation: Conversation
    switch (req.type) {
      case ConversationType.DIRECT:
        const existedConv = await this._convRepo.findDirectConversation(req.members[0], req.members[1])

        if (existedConv) {
          throw new ConflictException(ResponseDTO.fail("Conversation already existed"))
        }

        if (req.members.length === 2) {
          conversation = new Conversation({
            members: req.members?.map(id => new User({ id })),
            type: req.type
          })
        } else {
          throw new BadRequestException(ResponseDTO.fail("Amount of members too large"))
        }
        break;
      case ConversationType.GROUP:
        throw new NotAcceptableException(ResponseDTO.fail("Conversation type not supported"))
    }
    const conv = await this._convRepo.setTransaction(tx).create(conversation)

    return new CreateConversationResponse(conv)
  }
}
