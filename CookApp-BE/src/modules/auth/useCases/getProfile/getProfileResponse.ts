import { OmitType, PickType } from "@nestjs/swagger";
import { UserDTO } from "dtos/user.dto";

export class GetProfileResponse extends OmitType(UserDTO, ['username', 'password', 'phone', 'email']) {}
