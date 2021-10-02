import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class AppService {
  private _logger = new Logger(AppService.name);

  constructor(private _configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }

}
