import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { RegisterDTO } from "modules/auth/dtos/register.dto";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { IAuthentication } from "modules/auth/services/authentication.service";
export class RegisterCommand implements ICommand {
  registerDto: RegisterDTO;
  constructor(registerDto: RegisterDTO) {
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
  async execute(command: RegisterCommand): Promise<UserDTO> {
    return this._authService.register(command.registerDto);
  }
}


