import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Result } from "../base/result.base";

@Injectable()
export class TransformResponse implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Result) {
          return classToPlain(data.getResponseDTO());
        }
        return classToPlain(data);
      })
    );
  }
}
