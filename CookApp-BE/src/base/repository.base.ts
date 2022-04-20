import { ITransaction } from "adapters/typeormTransaction.adapter";

export abstract class BaseRepository {
  protected tx: ITransaction;

  public setTransaction(tx: ITransaction) {
    this.tx = tx;
    return this;
  }
}
