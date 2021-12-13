import { ICommand } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { ClientSession } from "mongoose";

export class BaseCommand implements ICommand {
  user?: UserDTO;
  session: ClientSession;
  constructor(session: ClientSession, user?: UserDTO ) {
    this.user = user;
    this.session = session;
  }
}
