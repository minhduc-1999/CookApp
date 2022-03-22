import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as snakeCaseKeys from 'snakecase-keys';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ConvertResponse<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        if (typeof data === 'object') {
          return snakeCaseKeys(data);
        }
        return data;
      }),
    );
  }
}
