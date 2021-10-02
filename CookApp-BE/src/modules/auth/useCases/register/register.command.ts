import { RegisterDTO } from "modules/auth/dtos/createUser.dto";
import { ICommand } from "../../../../base/command.base";

export class RegisterCommand implements ICommand {
  registerDto: RegisterDTO;
  constructor(registerDto: RegisterDTO) {
    this.registerDto = registerDto;
  }
}
