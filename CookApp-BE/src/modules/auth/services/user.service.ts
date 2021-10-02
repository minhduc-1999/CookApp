import { Injectable } from "@nestjs/common";
import { RegisterDTO } from "../dtos/createUser.dto";

export interface IUserService {
}
@Injectable()
class UserService implements IUserService {
  constructor() {}
}

export default UserService;
