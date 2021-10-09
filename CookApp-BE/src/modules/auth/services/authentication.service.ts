import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { ErrorCode } from "enums/errorCode.enum";
import { AuditDTO } from "base/dtos/audix.dto";
import { isEmail } from "class-validator";
import { ResponseDTO } from "base/dtos/response.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDTO } from "../dtos/user.dto";
import { RegisterDTO } from "../dtos/register.dto";
import _ = require("lodash");

export interface IAuthentication {
  register(registerDto: RegisterDTO): Promise<UserDTO>;
  getAuthUser(usernameOrEmail: string, password: string): Promise<UserDTO>;
  login(user: UserDTO): Promise<any>;
}
@Injectable()
class AuthenticationService implements IAuthentication {
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    private jwtService: JwtService
  ) {}
  async login(user: UserDTO): Promise<any> {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new BadRequestException(
        ResponseDTO.fail(
          "Wrong credentials provided",
          ErrorCode.INVALID_CREDENTIAL
        )
      );
    }
    return true;
  }

  async getAuthUser(
    usernameOrEmail: string,
    password: string
  ): Promise<UserDTO> {
    let user: UserDTO;
    if (isEmail(usernameOrEmail))
      user = await this._userRepo.getUserByEmail(usernameOrEmail);
    else user = await this._userRepo.getUserByUsername(usernameOrEmail);
    if (!user)
      throw new BadRequestException(
        ResponseDTO.fail(
          "Wrong credentials provided",
          ErrorCode.INVALID_CREDENTIAL
        )
      );
    await this.verifyPassword(password, user.password);
    return new UserDTO(user);
  }

  async register(registerDto: RegisterDTO): Promise<UserDTO> {
    const hashedPassword = await bcrypt.hashSync(registerDto.password, 10);
    const audit = new AuditDTO({
      updatedAt: _.now(),
    });
    const createdUser = await this._userRepo.createUser({
      ...registerDto,
      ...audit,
      password: hashedPassword,
    });
    return createdUser;
  }
}

export default AuthenticationService;
