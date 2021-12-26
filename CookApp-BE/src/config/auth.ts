import "dotenv/config";
import { UtilsService } from "../providers/utils.service";

export default {
  // authorizationURL: UtilsService.getConfig('AUTHORIZATION_URL'),
  // tokenURL: UtilsService.getConfig('TOKEN_URL'),
  jwtPrivateKey: UtilsService.getConfig("JWT_PRIVATE_KEY"),
  googleUserInfoUrl: UtilsService.getConfig("GOOGLE_USER_INFO_URL"),
  googleClientID: UtilsService.getConfig("GOOGLE_CLIENT_ID"),
  googleClientSecret: UtilsService.getConfig("GOOGLE_CLIENT_SECRET"),
};
