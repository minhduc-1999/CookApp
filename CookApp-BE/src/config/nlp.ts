
import { UtilsService } from '../providers/utils.service';

export default {
  credentialJson: UtilsService.getConfig("CREDENTIAL_JSON"),
  projectID: UtilsService.getConfig("PROJECT_ID"),
  langCode: UtilsService.getConfig("NLP_LANGUAGE_CODE", 'en')
};
