import * as path from "path";
import { UtilsService } from "../providers/utils.service";

export default {
  type: UtilsService.getConfig('DB_TYPE', "postgres"),
  host: UtilsService.getConfig('DB_HOST', 'localhost'),
  port: UtilsService.getConfig('DB_PORT', 5432),
  database: UtilsService.getConfig('DB_NAME'),
  username: UtilsService.getConfig('DB_APP_USER'),
  password: UtilsService.getConfig('DB_APP_PASS'),
  charset: 'UTF8',
  entities: [path.join(__dirname, '../**/**.entity{.ts,.js}')],
  synchronize: false,
  logging: UtilsService.getConfig('DB_LOGGING', 'error'),
  ssl: UtilsService.getConfig("APP_ENV") === 'production' ||
    UtilsService.getConfig("APP_ENV") == 'staging' ? { rejectUnauthorized: false } : false
};
