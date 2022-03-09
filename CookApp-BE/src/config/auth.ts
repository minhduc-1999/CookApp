import "dotenv/config";
import { UtilsService } from "../providers/utils.service";

export default {
  jwtPrivateKey: UtilsService.getConfig("JWT_PRIVATE_KEY"),
  jwtExpiration: UtilsService.getConfig("JWT_EXPIRES_IN"),
  googleUserInfoUrl: UtilsService.getConfig("GOOGLE_USER_INFO_URL"),
  googleClientID: UtilsService.getConfig("GOOGLE_CLIENT_ID"),
  googleClientSecret: UtilsService.getConfig("GOOGLE_CLIENT_SECRET"),
  googleCallbackUrl: UtilsService.getConfig("GOOGLE_CALLBACK_URL", "")
};
