import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import AuthConfig from "../../../config/auth";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { UserDTO } from "dtos/social/user.dto";
import { ResponseDTO } from "base/dtos/response.dto";
import { JwtAuthTokenPayload } from "base/jwtPayload";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { isImageKey } from "utils";

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

  async validate(payload: JwtAuthTokenPayload): Promise<UserDTO> {
    const user = await this._userRepo.getUserById(payload.sub);
    if (user.avatar && isImageKey(user.avatar)) {
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
