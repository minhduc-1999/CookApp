import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common/services/logger.service";
import { ConfigService } from "nestjs-config";

@Injectable()
export class GoogleAuthService {
  logger = new Logger(GoogleAuthService.name);

  constructor(
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService
  ) {}

  async getUserInfo(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this._httpService.get(
      this._configService.get("auth.googleUserInfoUrl"),
      { headers }
    );
  }
}
