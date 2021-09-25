import { Observable } from 'rxjs';
import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { TracerService } from '../providers/tracer.service';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    TracerService.setTraceId(uuidv4());

    return next.handle();
  }
}
