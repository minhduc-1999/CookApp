import { UserDTO } from "modules/auth/dtos/user.dto";

export class RegisterResponse extends UserDTO {
  constructor(option: Partial<UserDTO>) {
    super(option);
  }
}