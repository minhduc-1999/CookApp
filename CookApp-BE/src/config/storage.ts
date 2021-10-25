
import { UtilsService } from '../providers/utils.service';

export default {
  credentialPath: UtilsService.getConfig("CREDENTIAL_PATH", ""),
  storageBucket: UtilsService.getConfig("STORAGE_BUCKET"),
};
