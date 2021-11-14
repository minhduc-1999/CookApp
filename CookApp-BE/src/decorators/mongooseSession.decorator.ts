import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const MongooseSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.mongooseSession;
  }
);
