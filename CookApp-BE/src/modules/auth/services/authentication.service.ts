import { Inject, Injectable } from "@nestjs/common";
import { RegisterDTO } from "../dtos/createUser.dto";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../adapters/out/repositories/user.repository";

export interface IAuthentication {
  register(registerDto: RegisterDTO): Promise<any>;
}
@Injectable()
class AuthenticationService implements IAuthentication {
  constructor(@Inject("IUserRepository") private _userRepo: UserRepository) {}
  async register(registerDto: RegisterDTO): Promise<any> {
    const hashedPassword = await bcrypt.hashSync(registerDto.password, 10);
    const createdUser = await this._userRepo.createUser({
      ...registerDto,
      password: hashedPassword,
    });
    return createdUser;
  }
}

export default AuthenticationService;
