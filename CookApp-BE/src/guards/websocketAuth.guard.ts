import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthTokenPayload } from 'base/jwtPayload';
import { Socket } from 'socket.io';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private _jwtService: JwtService,
  ) { }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const token = context
      .switchToWs()
      .getClient<Socket>()
      .handshake
      .auth
      .token

    if (!token) return false

    const payload = this._jwtService.verify<JwtAuthTokenPayload>(token)

    if (!payload) return false

    return true
  }
}
