import { UtilsService } from "../providers/utils.service";

export default {
  database: UtilsService.getConfig('MONGO_DB_NAME'),
  connectionString: UtilsService.getConfig("MONGO_CONNECTION_STRING")
};
