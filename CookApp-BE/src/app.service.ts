import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { ResultService } from './base/result-service';

@Injectable()
export class AppService {
  private _logger = new Logger(AppService.name);

  constructor(private _configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }

  getAppConfig(): ResultService<any> {
    const result = new ResultService();
    try {
      const mobileConfig = this._configService.get('mobile');
      result.setData({ ...mobileConfig });
    } catch (error) {
      this._logger.error('Failed to get config');
      this._logger.error(error.message || error);
      result.setIsError(true);
      result.setErrorMessage('Failed to get config');
      result.setData(null);
      return result;
    }
    return result;
  }
}
