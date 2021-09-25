import { Observable } from 'rxjs';
import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';

import { TimezoneService } from '../providers/timezone.service';

@Injectable()
export class TimezoneInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    TimezoneService.setTimezone(request.header('timezone') || 'utc');

    return next.handle();
  }
}
