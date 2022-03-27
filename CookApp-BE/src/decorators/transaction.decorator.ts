import { applyDecorators, createParamDecorator, ExecutionContext, UseInterceptors } from "@nestjs/common";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { HttpTransactionInterceptor, WsTransactionInterceptor } from "interceptors/transaction.interceptor";
import { Socket } from "socket.io";

export const HttpRequestTransaction = () => {
  return applyDecorators(
    UseInterceptors(HttpTransactionInterceptor)
  )
}

export const WsRequestTransaction = () => {
  return applyDecorators(
    UseInterceptors(WsTransactionInterceptor)
  )
}

export const HttpParamTransaction = createParamDecorator((_data, ctx: ExecutionContext) : ITransaction => {
  const request = ctx.switchToHttp().getRequest();
  return request.transaction;
})

export const WsParamTransaction = createParamDecorator((_data, ctx: ExecutionContext): ITransaction => {
  const client = ctx.switchToWs().getClient<Socket>();
  return client.handshake.auth.transaction
})
