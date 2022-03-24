import { QueryRunner, Connection } from "typeorm"

export interface ITransaction {
  beginTransaction(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
  release(): Promise<void>
  getRef(): any
}

export class TypeOrmTransactionAdapter implements ITransaction {
  private queryRunner: QueryRunner

  constructor(connection: Connection) {
    this.queryRunner = connection.createQueryRunner()
  }
  getRef(): any {
    return this.queryRunner
  }
  async beginTransaction(): Promise<void> {
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction()
    console.log("start transaction")
  }
  async commit(): Promise<void> {
    await this.queryRunner.commitTransaction()
  }
  async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction()
  }
  async release(): Promise<void> {
    await this.queryRunner.release()
  }
}
