import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  HttpException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.error(err);
        if (err instanceof InternalServerErrorException) return throwError(() => err);
        if (err instanceof HttpException) {
          const message = err.getResponse()["message"];
          if (message instanceof Array) {
            err.getResponse()["message"] = message.join(", ");
          }
        }
        return throwError(() => err);
      })
    );
  }
}
