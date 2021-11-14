import { UserDTO } from "dtos/user.dto";

export class RegisterResponse extends UserDTO {
  constructor(option: Partial<UserDTO>) {
    super(option);
  }
}
