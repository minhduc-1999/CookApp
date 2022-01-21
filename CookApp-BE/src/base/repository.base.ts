import { Transaction } from "neo4j-driver";

export abstract class BaseRepository {
  protected tx: Transaction;

  public setTransaction(tx: Transaction) {
    this.tx = tx;
    return this;
  }
}
