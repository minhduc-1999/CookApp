import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { IAuthentication } from "modules/auth/services/authentication.service";

export class LoginCommand implements ICommand {
  user: UserDTO;
  constructor(user: UserDTO) {
    this.user = user;
  }
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject("IAuthentication")
    private _authService: IAuthentication
  ) {}
  async execute(command: LoginCommand): Promise<UserDTO> {
    return this._authService.login(command.user);
  }
}
