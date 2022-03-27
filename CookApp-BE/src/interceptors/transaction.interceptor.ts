import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { TypeOrmTransactionAdapter } from "adapters/typeormTransaction.adapter";
import { Observable } from "rxjs";
import { tap, catchError, finalize } from "rxjs/operators";
import { Socket } from "socket.io";
import { Connection } from "typeorm"

@Injectable()
export class HttpTransactionInterceptor implements NestInterceptor {

  constructor(
    private connection: Connection
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const tx = new TypeOrmTransactionAdapter(this.connection)

    await tx.beginTransaction()

    context.switchToHttp().getRequest().transaction = tx

    return next.handle()
      .pipe(
        tap(async () => {
          await tx.commit()
          await tx.release()
          console.log("commit tx")
        }),
        catchError(async e => {
          await tx.rollback()
          await tx.release()
          console.log("rollback tx")
          throw e
        }),
      )
  }
}


@Injectable()
export class WsTransactionInterceptor implements NestInterceptor {

  constructor(
    private connection: Connection
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const tx = new TypeOrmTransactionAdapter(this.connection)

    await tx.beginTransaction()

    const client = context.switchToWs().getClient<Socket>();

    client.handshake.auth.transaction = tx

    return next.handle()
      .pipe(
        tap(async () => {
          await tx.commit()
          await tx.release()
          console.log("commit tx")
        }),
        catchError(async e => {
          await tx.rollback()
          await tx.release()
          console.log("rollback tx")
          throw e
        }),
      )
  }
}
