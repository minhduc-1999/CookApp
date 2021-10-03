import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { RegisterDTO } from "../dtos/createUser.dto";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../adapters/out/repositories/user.repository";
import { MongoErrorCode } from "enums/mongoErrorCode.enum";
import { ErrorCode } from "enums/errorCode.enum";
import { ResponseMetaDTO } from "base/dtos/responseMeta.dto";
import { AuditDTO } from "base/dtos/audix.dto";
import { User } from "../domains/schemas/user.schema";
import { isEmail } from "class-validator";
import { ResponseDTO } from "base/dtos/response.dto";

export interface IAuthentication {
  register(registerDto: RegisterDTO): Promise<any>;
  getAuthUser(usernameOrEmail: string, password: string): Promise<User>;
}
@Injectable()
class AuthenticationService implements IAuthentication {
  constructor(@Inject("IUserRepository") private _userRepo: UserRepository) {}

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

  async getAuthUser(usernameOrEmail: string, password: string): Promise<User> {
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
    await this.verifyPassword(password, user.password);
    return user;
  }

  async register(registerDto: RegisterDTO): Promise<any> {
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
      return createdUser;
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
