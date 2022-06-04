import { UtilsService } from "../providers/utils.service";

export default {
  resetPasswordCallback: UtilsService.getConfig("RESET_PASSWORD_CALLBACK"),
  resetPasswordPageUrl: UtilsService.getConfig("RESET_PASSWORD_PAGE_URL"),
  logoUrl: UtilsService.getConfig("LOGO_URL"),
};
