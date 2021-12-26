import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import AuthConfig from "../../../config/auth";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { UserDTO } from "dtos/social/user.dto";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { JwtAuthTokenPayload } from "base/jwtPayload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(@Inject("IUserRepository") private _userRepo: IUserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConfig.jwtPrivateKey,
    });
  }

  async validate(payload: JwtAuthTokenPayload): Promise<UserDTO> {
    const user = await this._userRepo.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        ResponseDTO.fail("Wrong credentials provided")
      );
    }
    return user;
  }
}
