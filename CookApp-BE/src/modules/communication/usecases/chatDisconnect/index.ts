import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";

export class ChatDiconnectCommand extends BaseCommand {
  constructor(
    user: User,
  ) {
    super(null, user);
  }
}

@CommandHandler(ChatDiconnectCommand)
export class ChatDisconnectCommandHandler
  implements ICommandHandler<ChatDiconnectCommand>
{
  constructor(
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
  ) { }
  async execute(command: ChatDiconnectCommand): Promise<void> {
    const { user } = command
    this._userRepo.updateStatus(user)
  }
}
