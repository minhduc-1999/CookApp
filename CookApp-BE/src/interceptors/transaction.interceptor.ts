import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { TypeOrmTransactionAdapter } from "adapters/typeormTransaction.adapter";
import { Socket } from "net";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Connection } from "typeorm";

@Injectable()
export class HttpTransactionInterceptor implements NestInterceptor {
  private _logger = new Logger(HttpTransactionInterceptor.name);

  constructor(private connection: Connection) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const tx = new TypeOrmTransactionAdapter(this.connection);

    this._logger.log("start transaction");
    await tx.beginTransaction();

    context.switchToHttp().getRequest().transaction = tx;

    return next.handle().pipe(
      tap(async () => {
        await tx.commit();
        await tx.release();
        this._logger.log("commit tx");
      }),
      catchError(async (e) => {
        await tx.rollback();
        await tx.release();
        this._logger.log("rollback tx");
        throw e;
      })
    );
  }
}

@Injectable()
export class WsTransactionInterceptor implements NestInterceptor {
  constructor(private connection: Connection) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const tx = new TypeOrmTransactionAdapter(this.connection);

    await tx.beginTransaction();

    const client = context.switchToWs().getClient<Socket>();

    // client.handshake.auth.transaction = tx

    return next.handle().pipe(
      tap(async () => {
        await tx.commit();
        await tx.release();
        console.log("commit tx");
      }),
      catchError(async (e) => {
        await tx.rollback();
        await tx.release();
        console.log("rollback tx");
        throw e;
      })
    );
  }
}
