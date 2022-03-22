import { applyDecorators, createParamDecorator, ExecutionContext, UseInterceptors } from "@nestjs/common";
import { Neo4jTransactionInterceptor } from "modules/neo4j/interceptors/transaction.interceptor";
import { Transaction } from "neo4j-driver";

export const RequestTransaction = () => {
  return applyDecorators(
    UseInterceptors(Neo4jTransactionInterceptor)
  )
}

export const ParamTransaction = createParamDecorator((_data, ctx: ExecutionContext): Transaction => {
  const request = ctx.switchToHttp().getRequest();
  return request.transaction as Transaction;
})
