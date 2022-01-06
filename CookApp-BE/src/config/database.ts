import * as path from "path";
import { UtilsService } from "../providers/utils.service";

export default {
  database: UtilsService.getConfig("MONGO_DATABASE"),
  connectionString: UtilsService.getConfig("CONNECTION_STRING"),
};
