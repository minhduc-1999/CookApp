import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { Transaction } from "neo4j-driver";
import { LoginResponse } from "./loginResponse";

export class LoginCommand extends BaseCommand {
  constructor(tx: Transaction, user: User) {
    super(tx, user)
  }
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject("IAuthentication")
    private _authService: IAuthentication
  ) {}
  async execute(command: LoginCommand): Promise<LoginResponse> {
    return this._authService.login(command.user);
  }
}
