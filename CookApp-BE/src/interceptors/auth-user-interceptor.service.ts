import {
  CallHandler, ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { ContextService } from 'providers/context.service';
import { Observable } from 'rxjs';


@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // const user = <UserEntity>request.user;
    // ContextService.set("auth_user", user)

    return next.handle();
  }
}
