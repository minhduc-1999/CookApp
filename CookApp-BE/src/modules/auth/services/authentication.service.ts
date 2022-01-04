import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { ErrorCode } from "enums/errorCode.enum";
import { isEmail } from "class-validator";
import { ResponseDTO } from "base/dtos/response.dto";
import { JwtService } from "@nestjs/jwt";
import _ = require("lodash");
import { LoginResponse } from "../useCases/login/loginResponse";
import { UserDTO } from "dtos/social/user.dto";
import { JwtAuthTokenPayload } from "base/jwtPayload";

export interface IAuthentication {
  getAuthUser(usernameOrEmail: string, password: string): Promise<UserDTO>;
  login(user: UserDTO): Promise<LoginResponse>;
}
@Injectable()
class AuthenticationService implements IAuthentication {
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    private jwtService: JwtService
  ) {}
  async login(user: UserDTO): Promise<LoginResponse> {
    const payload: JwtAuthTokenPayload = { sub: user.id};
    return {
      accessToken: this.jwtService.sign(payload),
      userId: user.id,
      emailVerified: user.emailVerified
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
    return user;
  }
}

export default AuthenticationService;
