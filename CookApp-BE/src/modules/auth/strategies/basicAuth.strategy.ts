import {
  Inject,
  Injectable,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "domains/social/user.domain";
import { Strategy } from "passport-local";
import { IAuthentication } from "../services/authentication.service";

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy, "basic") {
  constructor(
    @Inject("IAuthentication") private _authService: IAuthentication
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this._authService.getAuthUser(username, password);
    return user;
  }
}
