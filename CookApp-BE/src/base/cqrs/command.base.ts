import { ICommand } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { Transaction } from "neo4j-driver";

export class BaseCommand implements ICommand {
  user?: User;
  tx: Transaction
  constructor(tx: Transaction, user?: User ) {
    this.user = user;
    this.tx = tx;
  }
}
