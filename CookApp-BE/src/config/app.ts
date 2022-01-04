import { UtilsService } from '../providers/utils.service';

// tslint:disable-next-line: no-default-export
export default {
  host: UtilsService.getConfig('APP_HOST', '0.0.0.0'),
  port: UtilsService.getConfig('PORT', 3000),
  env: UtilsService.getConfig('APP_ENV', 'development'),
};
