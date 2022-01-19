import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { UserDTO } from "dtos/social/user.dto";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { ClientSession } from "mongoose";
import { LoginResponse } from "./loginResponse";

export class LoginCommand extends BaseCommand {
  constructor(session: ClientSession, user: UserDTO) {
    super(session, user)
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
