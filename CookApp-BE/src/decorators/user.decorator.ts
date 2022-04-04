import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "domains/social/user.domain";

export const HttpUserReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

export const WsUserReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const client = ctx.switchToWs().getClient()
    return client.handshake.auth.user
  }
);
