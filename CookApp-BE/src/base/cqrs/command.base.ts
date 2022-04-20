import { ICommand } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { User } from "domains/social/user.domain";

export class BaseCommand implements ICommand {
  user?: User;
  tx: ITransaction
  constructor(tx: ITransaction, user?: User ) {
    this.user = user;
    this.tx = tx;
  }
}
