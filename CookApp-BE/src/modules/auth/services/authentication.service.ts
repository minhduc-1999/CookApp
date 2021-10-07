import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { RegisterDTO } from "../dtos/createUser.dto";
import * as bcrypt from "bcrypt";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { MongoErrorCode } from "enums/mongoErrorCode.enum";
import { ErrorCode } from "enums/errorCode.enum";
import { ResponseMetaDTO } from "base/dtos/responseMeta.dto";
import { AuditDTO } from "base/dtos/audix.dto";
import { User } from "../domains/schemas/user.schema";
import { isEmail } from "class-validator";
import { ResponseDTO } from "base/dtos/response.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDTO } from "../dtos/user.dto";

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
      accessToken: this.jwtService.sign(payload)
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
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
  }

  async getAuthUser(
    usernameOrEmail: string,
    password: string
  ): Promise<UserDTO> {
    let user: User;
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
    console.log("[]", user.id);
    await this.verifyPassword(password, user.password);
    return new UserDTO(user);
  }

  async register(registerDto: RegisterDTO): Promise<UserDTO> {
    const hashedPassword = await bcrypt.hashSync(registerDto.password, 10);
    try {
      const audit = new AuditDTO({
        createdBy: "system",
      });
      const createdUser = await this._userRepo.createUser({
        ...registerDto,
        ...audit,
        password: hashedPassword,
      });
      return new UserDTO(createdUser);
    } catch (error) {
      console.error(error);
      if (error.code === MongoErrorCode.DUPLICATE_KEY)
        throw new BadRequestException(
          ResponseMetaDTO.fail(
            "This user is already existed",
            ErrorCode.ACCOUNT_ALREADY_EXISTED
          )
        );
      throw new InternalServerErrorException();
    }
  }
}

export default AuthenticationService;
