import { applyDecorators, createParamDecorator, ExecutionContext, UseInterceptors } from "@nestjs/common";
import { Neo4jTransactionInterceptor, WsTransactionInterceptor } from "modules/neo4j/interceptors/transaction.interceptor";
import { Transaction } from "neo4j-driver";
import { Socket } from "socket.io";

export const RequestTransaction = () => {
  return applyDecorators(
    UseInterceptors(Neo4jTransactionInterceptor)
  )
}

export const WsRequestTransaction = () => {
  return applyDecorators(
    UseInterceptors(WsTransactionInterceptor)
  )
}

export const ParamTransaction = createParamDecorator((_data, ctx: ExecutionContext): Transaction => {
  const request = ctx.switchToHttp().getRequest();
  return request.transaction as Transaction;
})

export const WsParamTransaction = createParamDecorator((_data, ctx: ExecutionContext): Transaction => {
  const client = ctx.switchToWs().getClient<Socket>();
  return client.handshake.auth.transaction as Transaction
})
