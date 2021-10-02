// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { OAuth2Strategy } from 'passport-oauth';
// import AuthConfig from '../../../config/auth';
// import { UserService } from '../services/user.service';
// @Injectable()
// export class OTableStrategy extends PassportStrategy(OAuth2Strategy, 'otable') {
//   constructor(
//     private readonly _userService: UserService,
//     private readonly _otableAuthService: OTableAuthService,
//   ) {
//     super({
//       authorizationURL: AuthConfig.authorizationURL,
//       tokenURL: AuthConfig.tokenURL,
//       clientID: AuthConfig.clientID,
//       clientSecret: AuthConfig.clientSecret,
//       callbackURL: AuthConfig.callbackURL,
//       state: 'pulsely123', // ? why?,
//       scope: ['user'],
//       passReqToCallback: true,
//     });
//   }

//   async validate(
//     request: any,
//     accessToken: string,
//     refreshToken: string,
//     profile,
//     done: Function,
//   ) {
//     return this._otableAuthService
//       .getUserInfo(accessToken)
//       .then(async (userInfo) => {
//         let res = await this._userService.getUserByUsername(
//           userInfo.data.username,
//         );
//         if (!res) {
//           // create new user
//           res = await this._userService.createNewUser(userInfo.data);
//         }
//         return res;
//       })
//       .catch(console.error);
//   }
// }
