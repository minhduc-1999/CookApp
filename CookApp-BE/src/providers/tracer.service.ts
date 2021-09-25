import { ContextService } from './context.service';

export class TracerService {
  private static readonly _traceIdKey = 'traceId';

  static getTraceId<T>(): T {
    return ContextService.get(this._traceIdKey);
  }

  static setTraceId(value: any): void {
    ContextService.set(this._traceIdKey, value);
  }
}
