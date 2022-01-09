import { UtilsService } from '../providers/utils.service';

export default {
    appID: UtilsService.getConfig("ONESIGNAL_APP_ID"),
    apiKey: UtilsService.getConfig("ONESIGNAL_REST_API_KEY"),
    apiBaseUrl: UtilsService.getConfig("ONESIGNAL_API_BASE_URL"),
}