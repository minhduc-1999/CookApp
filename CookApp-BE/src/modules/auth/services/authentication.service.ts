import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserErrorCode } from "enums/errorCode.enum";
import { isEmail } from "class-validator";
import { ResponseDTO } from "base/dtos/response.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginResponse } from "../useCases/login/loginResponse";
import { User } from "domains/social/user.domain";
import { JwtAuthTokenPayload } from "base/jwtPayload";
import { ConfigService } from "nestjs-config";
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { IUserRepository } from "../interfaces/repositories/user.interface";

export interface IAuthentication {
  getAuthUser(usernameOrEmail: string, password: string): Promise<User>;
  login(user: User): Promise<LoginResponse>;
}
@Injectable()
class AuthenticationService implements IAuthentication {
  private _auth: Auth;
  private _logger: Logger = new Logger(AuthenticationService.name);
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    private jwtService: JwtService,
    private _configService: ConfigService
  ) {
    const firebaseCredentialPath = this._configService.get(
      "storage.credentialJson"
    );

    if (getApps().length === 0) {
      initializeApp({
        credential: firebaseCredentialPath
          ? cert(firebaseCredentialPath)
          : applicationDefault(),
      });
    }
    this._auth = getAuth();
  }
  async login(user: User): Promise<LoginResponse> {
    const payload: JwtAuthTokenPayload = { sub: user.id };
    return this._auth
      .createCustomToken(user.id)
      .then((token) => {
        return {
          loginToken: token,
          accessToken: this.jwtService.sign(payload),
          userId: user.id,
          emailVerified: user.account.emailVerified,
          email: user.account.email,
          role: user.account.role.sign,
        };
      })
      .catch((error) => {
        this._logger.error(error);
        throw new InternalServerErrorException(
          ResponseDTO.fail("Error when creating login token")
        );
      });
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
          UserErrorCode.INVALID_CREDENTIAL
        )
      );
    }
    return true;
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
          UserErrorCode.INVALID_CREDENTIAL
        )
      );
    await this.verifyPassword(password, user.account.password);
    return user;
  }
}

export default AuthenticationService;
