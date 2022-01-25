import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from "@nestjs/common";
import { Observable } from "rxjs";
import { Transaction } from "neo4j-driver";
import { tap, catchError } from "rxjs/operators";
import { INeo4jService } from "../services/neo4j.service";

@Injectable()
export class Neo4jTransactionInterceptor implements NestInterceptor {

  constructor(
    @Inject("INeo4jService")
    private readonly neo4jService: INeo4jService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const transaction: Transaction = this.neo4jService.beginTransaction()

    context.switchToHttp().getRequest().transaction = transaction

    return next.handle()
      .pipe(
        tap(() => {
          transaction.commit()
        }),
        catchError(e => {
          transaction.rollback()
          throw e
        }),
      )

  }

}
