
import { UtilsService } from '../providers/utils.service';

export default {
  credentialJson: UtilsService.getConfig("CREDENTIAL_JSON"),
  credentialPath: UtilsService.getConfig("CREDENTIAL_PATH", ""),
  storageBucket: UtilsService.getConfig("STORAGE_BUCKET"),
  presignedLinkExpiration: UtilsService.getConfig(
    "PRESIGNED_LINK_EXPIRATION",
    5
  ),
  maxImagesPerRequest: UtilsService.getConfig("MAX_IMAGES_PER_REQ", 1),
  publicUrl: UtilsService.getConfig("PUBLIC_URL"),
};
