import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!roles || roles.length === 0) {
      return true;
    }
    return roles.includes(user.userType);
  }
}
