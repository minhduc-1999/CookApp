import { PickType } from "@nestjs/swagger";
import { UserDTO } from "dtos/social/user.dto";

export class RegisterResponse extends PickType(UserDTO, ['id']) {
  
}
