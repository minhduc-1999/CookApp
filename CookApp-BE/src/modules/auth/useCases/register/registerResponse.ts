import { PickType } from "@nestjs/swagger";
import { UserDTO } from "dtos/user.dto";

export class RegisterResponse extends PickType(UserDTO, ['id']) {
  
}
