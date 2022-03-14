import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import AuthConfig from "../../../config/auth";
import { User } from "domains/social/user.domain";
import { ResponseDTO } from "base/dtos/response.dto";
import { JwtAuthTokenPayload } from "base/jwtPayload";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IUserRepository } from "../interfaces/repositories/user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    @Inject("IStorageService") private _storageService: IStorageService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConfig.jwtPrivateKey,
    });
  }

  async validate(payload: JwtAuthTokenPayload): Promise<User> {
    const user = await this._userRepo.getUserById(payload.sub);
    if (user.avatar && user.avatar.isValidKey()) {
      user.avatar = (
        await this._storageService.getDownloadUrls([user.avatar])
      )[0];
    }
    if (!user) {
      throw new UnauthorizedException(
        ResponseDTO.fail("Wrong credentials provided")
      );
    }
    return user;
  }
}
