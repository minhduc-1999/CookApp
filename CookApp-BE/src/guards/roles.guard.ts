import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'domains/social/user.domain';
import _ = require('lodash');

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controllerRoles = this.reflector.get<string[]>('roles', context.getClass()) ?? []
    const handlerRoles = this.reflector.get<string[]>('roles', context.getHandler()) ?? []
    const roles = _.uniq([...controllerRoles, ...handlerRoles])

    const request = context.switchToHttp().getRequest();

    const user = request.user as User
    if (!roles || roles.length === 0) {
      return true;
    }
    //TODO
    return true
  }
}
