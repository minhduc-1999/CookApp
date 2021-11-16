import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { catchError, Observable, tap } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ClientSession, Connection } from "mongoose";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(TransactionInterceptor.name)
  constructor(
    @InjectConnection() private readonly _connection: Connection,
    private _reflector: Reflector
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const hasTransaction = this._reflector.get<boolean>(
      "hasTransaction",
      context.getHandler()
    );
    let session: ClientSession;
    if (hasTransaction) {
      const request = context.switchToHttp().getRequest();
      session = await this._connection.startSession();
      this.logger.log("create transaction");
      request.mongooseSession = session;
      session.startTransaction();
    }

    return next.handle().pipe(
      tap(async () => {
        if (hasTransaction) {
          this.logger.log("commit transaction");
          await session.commitTransaction();
          session.endSession();
        }
      }),
      catchError(async (err) => {
        if (hasTransaction) {
          this.logger.log("abort transaction");
          await session.abortTransaction();
          session.endSession();
        }
        throw err;
      })
    );
  }
}
