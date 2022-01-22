import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Driver, int, Result, Session, Transaction } from 'neo4j-driver';
import { Neo4jConfig } from '../interfaces/config';
import neo4j from 'neo4j-driver'
import { isArray, isObject } from 'lodash';

export interface INeo4jService {
  getReadSession(database?: string): Session
  getWriteSession(database?: string): Session
  beginTransaction(database?: string): Transaction
  read(cypher: string, params?: Record<string, any>, database?: string): Result
  write(cypher: string, tx: Transaction, params?: Record<string, any>): Result
}
@Injectable()
export class Neo4jService implements INeo4jService {
  private _logger: Logger = new Logger(Neo4jService.name)
  constructor(
    @Inject('NEO4J_CONFIG') private readonly config: Neo4jConfig,
    @Inject('NEO4J_DRIVER') private readonly driver: Driver
  ) { }

  getDriver(): Driver {
    return this.driver;
  }

  getConfig(): Neo4jConfig {
    return this.config;
  }

  int(value: number) {
    return int(value)
  }

  beginTransaction(database?: string): Transaction {
    const session = this.getWriteSession(database)

    return session.beginTransaction()
  }

  getReadSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.READ,
    })
  }

  getWriteSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.WRITE,
    })
  }

  read(cypher: string, params?: Record<string, any>, database?: string): Result {
    const session = this.getReadSession(database)
    return session.run(cypher, params)
  }

  write(cypher: string, tx: Transaction, params?: Record<string, any>): Result {
    if (!tx) {
      this._logger.error("Not found transaction for write operation")
      throw new InternalServerErrorException();
    }

    return tx.run(cypher, params)
  }

  onApplicationShutdown() {
    return this.driver.close()
  }
}
