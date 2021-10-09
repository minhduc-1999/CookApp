import {
  Inject,
  Injectable,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserDTO } from "../dtos/user.dto";
import { IAuthentication } from "../services/authentication.service";

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy, "basic") {
  constructor(
    @Inject("IAuthentication") private _authService: IAuthentication
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<UserDTO> {
    const user = await this._authService.getAuthUser(username, password);
    return user;
  }
}
