import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "domains/social/user.domain";
import { ExternalProviderType } from "enums/externalProvider.enum";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import AuthConfig from "../../../config/auth";
import { IUserRepository } from "../interfaces/repositories/user.interface";
import { Account, ExternalProvider } from "domains/social/account.domain";
import { IRoleRepository } from "../adapters/out/repositories/role.repository";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("IRoleRepository")
    private _roleRepo: IRoleRepository,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService
  ) {
    super({
      clientID: AuthConfig.googleClientID,
      clientSecret: AuthConfig.googleClientSecret,
      callbackURL: AuthConfig.googleCallbackUrl,
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { name, emails, photos, id, displayName } = profile;
    const userRole = await this._roleRepo.getRole("user");
    const account = new Account({
      email: emails[0].value,
      externalProvider: new ExternalProvider({
        externalID: id,
        type: ExternalProviderType.GOOGLE,
      }),
      emailVerified: true,
      role: userRole,
      username: emails[0].value,
    });
    const user: User = new User({
      avatar: photos[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      displayName: displayName,
      account,
    });
    let res = await this._userRepo.getUserByEmail(user.account.email);

    if (!res) {
      try {
        res = await this._userRepo.createUser(user);
        await this._configurationService.setupConfigForNewUser(res);
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
    done(null, res);
  }
}
