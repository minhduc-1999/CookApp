import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "domains/social/user.domain";
import _ = require("lodash");

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controllerRoles =
      this.reflector.get<string[]>("roles", context.getClass()) ?? [];
    const handlerRoles =
      this.reflector.get<string[]>("roles", context.getHandler()) ?? [];
    const requireRoles = _.uniq([...controllerRoles, ...handlerRoles]);

    const request = context.switchToHttp().getRequest();

    const user = request.user as User;
    if (requireRoles.length === 0) {
      return true;
    }
    const userRole = user?.account?.role?.sign;
    return requireRoles.includes(userRole);
  }
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controllerPermissions =
      this.reflector.get<string[]>("permissions", context.getClass()) ?? [];
    const handlerPermissions =
      this.reflector.get<string[]>("permissions", context.getHandler()) ?? [];
    const requirePermissions = _.uniq([...controllerPermissions, ...handlerPermissions]);

    const request = context.switchToHttp().getRequest();

    const user = request.user as User;
    if (requirePermissions.length === 0) {
      return true;
    }
    const userPermissions = user?.account?.role?.permissions?.map(
      (pms) => pms.sign
    ) ?? [];
    const inter = _.intersection(requirePermissions, userPermissions);
    return inter.length > 0;
  }
}
