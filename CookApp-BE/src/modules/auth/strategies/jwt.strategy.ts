import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import AuthConfig from "../../../config/auth";
import { IUserRepository } from "../adapters/out/repositories/user.repository";
import { UserDTO } from "dtos/user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(@Inject("IUserRepository") private _userRepo: IUserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConfig.jwtPrivateKey,
    });
  }

  async validate(payload: any): Promise<UserDTO> {
    const user = await this._userRepo.getUserById(payload.sub);
    return user;
  }
}
