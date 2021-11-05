import { UserDTO } from "modules/auth/dtos/user.dto";

export class GetProfileResponse extends UserDTO {
  constructor(option: Partial<UserDTO>) {
    super(option);
  }
}
