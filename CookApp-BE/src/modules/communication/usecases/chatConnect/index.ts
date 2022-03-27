import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";

export class ChatConnectCommand extends BaseCommand {
  clientID: string;
  constructor(
    user: User,
    clientID: string,
  ) {
    super(null, user);
    this.clientID = clientID;
  }
}

@CommandHandler(ChatConnectCommand)
export class ChatConnectCommandHandler
  implements ICommandHandler<ChatConnectCommand>
{
  constructor(
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
  ) { }
  async execute(command: ChatConnectCommand): Promise<void> {
    const { user, clientID } = command
    this._userRepo.updateStatus(user, clientID)
  }
}
