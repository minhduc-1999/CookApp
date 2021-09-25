import { ContextService } from './context.service';

export class TimezoneService {
  private static readonly _timezoneKey = 'timezone';

  static getTimezone(): string {
    return ContextService.get(this._timezoneKey);
  }

  static setTimezone(value: any): void {
    ContextService.set(this._timezoneKey, value);
  }
}
