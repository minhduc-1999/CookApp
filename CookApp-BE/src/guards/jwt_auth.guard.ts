import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends NestAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const authorization = context
      .switchToHttp()
      .getRequest()
      .header('authorization');

    if ((!authorization || authorization === 'undefined') && isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
