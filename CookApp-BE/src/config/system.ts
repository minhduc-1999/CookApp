import { UtilsService } from "../providers/utils.service";

export default {
  emailVerificationCallback: UtilsService.getConfig(
    "EMAIL_VERIFICATION_CALLBACK"
  ),
  resetPasswordCallback: UtilsService.getConfig("RESET_PASSWORD_CALLBACK"),
  emailVerificationCallbackExpiration: UtilsService.getConfig(
    "EMAIL_VERIFICATION_CALLBACK_EXPIRATION",
    "5m"
  ),
  emailVerificationSecret: UtilsService.getConfig("EMAIL_VERIFICATION_SECRET"),
  resetPasswordPageUrl: UtilsService.getConfig("RESET_PASSWORD_PAGE_URL"),
  logoUrl: UtilsService.getConfig("LOGO_URL"),
};
