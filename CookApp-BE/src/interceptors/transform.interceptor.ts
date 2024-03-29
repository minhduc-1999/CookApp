import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { clean } from "utils";
import { Result } from "../base/result.base";

@Injectable()
export class TransformResponse implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Result) {
          return classToPlain(clean(data.getResponseDTO()));
        }
        return classToPlain(clean(data));
        // if (data instanceof Result) {
        //   return clean(classToPlain(data.getResponseDTO()));
        // }
        // return clean(classToPlain(data));
      })
    );
  }
}
