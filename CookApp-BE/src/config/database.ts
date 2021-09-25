// src/config/app.ts

import * as path from 'path';
import { UtilsService } from '../providers/utils.service';

// tslint:disable-next-line: no-default-export
export default {
  type: UtilsService.getConfig('DB_TYPE', 'mysql'),
  host: UtilsService.getConfig('DB_HOST', 'localhost'),
  port: UtilsService.getConfig('DB_PORT', 3307),
  database: UtilsService.getConfig('DB_NAME'),
  username: UtilsService.getConfig('DB_APP_USER'),
  password: UtilsService.getConfig('DB_APP_PASS'),
  charset: 'utf8mb4',
  entities: [path.join(__dirname, '../**/**.entity{.ts,.js}')],
  synchronize: false,
  logging: UtilsService.getConfig('DB_LOGGING', 'error'),
};
