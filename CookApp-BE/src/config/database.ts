
import * as path from 'path';
import { UtilsService } from '../providers/utils.service';

export default {
  username: UtilsService.getConfig("MONGO_USERNAME", "admin"),
  password: UtilsService.getConfig("MONGO_PASSWORD", "admin"),
  database: UtilsService.getConfig("MONGO_DATABASE"),
  host: UtilsService.getConfig("MONGO_HOST"),
};
