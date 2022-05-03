import { UtilsService } from "../providers/utils.service";

export default {
  host: UtilsService.getConfig("TRANSPORT_HOST"),
  port: UtilsService.getConfig("TRANSPORT_PORT"),
  user: UtilsService.getConfig("EMAIL_USER"),
  clientId: UtilsService.getConfig("EMAIL_CLIENT_ID"),
  clientSecret: UtilsService.getConfig("EMAIL_CLIENT_SECRET"),
  defaultFrom: UtilsService.getConfig("DEFAULT_FROM"),
  accessToken: UtilsService.getConfig("EMAIL_ACCESS_TOKEN"),
  refreshToken: UtilsService.getConfig("EMAIL_REFRESH_TOKEN"),
  emailVerificationCallback: UtilsService.getConfig(
    "EMAIL_VERIFICATION_CALLBACK"
  ),
  emailVerificationCallbackExpiration: UtilsService.getConfig(
    "EMAIL_VERIFICATION_CALLBACK_EXPIRATION",
    "5m"
  ),
  emailVerificationSecret: UtilsService.getConfig("EMAIL_VERIFICATION_SECRET"),
};
