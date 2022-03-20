import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { Transaction } from "neo4j-driver";

export class ChatDiconnectCommand extends BaseCommand {
  constructor(
    user: User,
    tx: Transaction
  ) {
    super(tx, user);
  }
}

@CommandHandler(ChatDiconnectCommand)
export class ChatDisconnectCommandHandler
  implements ICommandHandler<ChatDiconnectCommand>
{
  constructor(
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("INeo4jService")
    private _neo4jService: INeo4jService
  ) { }
  async execute(command: ChatDiconnectCommand): Promise<void> {
    const {user} = command
    const tx = this._neo4jService.beginTransaction()
    try {
    this._userRepo.setTransaction(tx).updateStatus(user)
      tx.commit()
    }
    catch {
      tx.rollback()
    }
  }
}
