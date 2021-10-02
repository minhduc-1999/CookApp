import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { RegisterCommand } from "./register.command";

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject("IAuthentication")
    private _authService: IAuthentication
  ) {}
  async execute(command: RegisterCommand): Promise<string> {
    return this._authService.register(command.registerDto);
  }
}

export { RegisterCommand } from "./register.command";

