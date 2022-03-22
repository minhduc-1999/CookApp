import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'domains/social/user.domain';
import { ExternalProvider } from 'enums/externalProvider.enum';
import { Strategy, VerifyCallback } from "passport-google-oauth20"
import AuthConfig from "../../../config/auth"
import { INeo4jService } from 'modules/neo4j/services/neo4j.service';
import { IUserRepository } from '../interfaces/repositories/user.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("INeo4jService")
    private readonly _neo4jService: INeo4jService
  ) {
    super({
      clientID: AuthConfig.googleClientID,
      clientSecret: AuthConfig.googleClientSecret,
      callbackURL: AuthConfig.googleCallbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos, id, displayName } = profile
    const user: User = new User({
      avatar: photos[0].value,
      profile: {
        firstName: name.givenName,
        lastName: name.familyName,
      },
      email: emails[0].value,
      externalProvider: {
        id: id,
        type: ExternalProvider.GOOGLE,
      },
      displayName: displayName,
      emailVerified: true
    });
    let res = await this._userRepo.getUserByEmail(user.email);

    if (!res) {
      // create new user
      const tx = this._neo4jService.beginTransaction()
      try {
        res = await this._userRepo.setTransaction(tx).createUser(user);
        tx.commit()
      }
      catch (err) {
        tx.rollback()
      }
    }

    done(null, res)
  }
}
