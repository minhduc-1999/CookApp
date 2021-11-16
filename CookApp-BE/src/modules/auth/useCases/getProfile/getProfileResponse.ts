import { UserDTO } from "dtos/user.dto";

export class GetProfileResponse extends UserDTO {
  constructor(option: Partial<UserDTO>) {
    super(option);
  }
}
