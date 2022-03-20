import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { Transaction } from "neo4j-driver";

export class ChatConnectCommand extends BaseCommand {
  clientID: string;
  constructor(
    user: User,
    clientID: string,
    tx: Transaction
  ) {
    super(tx, user);
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
    @Inject("INeo4jService")
    private _neo4jService: INeo4jService
  ) { }
  async execute(command: ChatConnectCommand): Promise<void> {
    const { user, clientID } = command
    const tx = this._neo4jService.beginTransaction()
    try {
      this._userRepo.setTransaction(tx).updateStatus(user, clientID)
      tx.commit()
    }
    catch {
      tx.rollback()
    }
  }
}
