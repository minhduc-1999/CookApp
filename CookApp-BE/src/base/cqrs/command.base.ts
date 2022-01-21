import { ICommand } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { Transaction } from "neo4j-driver";

export class BaseCommand implements ICommand {
  user?: UserDTO;
  tx: Transaction
  constructor(tx: Transaction, user?: UserDTO ) {
    this.user = user;
    this.tx = tx;
  }
}
