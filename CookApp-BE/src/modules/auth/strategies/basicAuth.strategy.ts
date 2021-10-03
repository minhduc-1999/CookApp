import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "../domains/schemas/user.schema";
import { IAuthentication } from "../services/authentication.service";

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor(
    @Inject("IAuthentication") private _authService: IAuthentication
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    return this._authService.getAuthUser(username, password);
  }
}