import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { RegisterRequest } from "./registerRequest";
import { RegisterResponse } from "./registerResponse";
export class RegisterCommand implements ICommand {
  registerDto: RegisterRequest;
  constructor(registerDto: RegisterRequest) {
    this.registerDto = registerDto;
  }
}
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject("IAuthentication")
    private _authService: IAuthentication
  ) {}
  async execute(command: RegisterCommand): Promise<RegisterResponse> {
    return this._authService.register(command.registerDto);
  }
}


