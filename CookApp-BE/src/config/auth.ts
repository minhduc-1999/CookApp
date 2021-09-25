import 'dotenv/config';
import { UtilsService } from '../providers/utils.service';

// tslint:disable-next-line: no-default-export
export default {
  // authorizationURL: UtilsService.getConfig('AUTHORIZATION_URL'),
  // tokenURL: UtilsService.getConfig('TOKEN_URL'),
  jwtPrivateKey: UtilsService.getConfig('JWT_PRIVATE_KEY')
}
