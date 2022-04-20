import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import AuthConfig from "../../../config/auth";
import { User } from "domains/social/user.domain";
import { JwtAuthTokenPayload } from "base/jwtPayload";
import { IUserService } from "../services/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    @Inject("IUserService") private _userService: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConfig.jwtPrivateKey,
    });
  }

  async validate(payload: JwtAuthTokenPayload): Promise<User> {
    const user = await this._userService.getUserById(payload.sub);
    return user;
  }
}
