import { UtilsService } from "../providers/utils.service";

export default {
  apiKey: UtilsService.getConfig("FIREBASE_API_KEY"),
  authDomain: UtilsService.getConfig("FIREBASE_AUTH_DOMAIN"),
  projectID: UtilsService.getConfig("FIREBASE_PROJECT_ID"),
  storageBucket: UtilsService.getConfig("FIREBASE_STORAGE_BUCKET", 1),
  messagingSenderID: UtilsService.getConfig("FIREBASE_MESSAGING_SENDER_ID"),
  appID: UtilsService.getConfig("FIREBASE_APP_ID"),
  measurement_id: UtilsService.getConfig("FIREBASE_MEASUREMENT_ID"),
};
