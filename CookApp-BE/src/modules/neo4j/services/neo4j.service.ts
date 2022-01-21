import { Inject, Injectable } from '@nestjs/common';
import { Driver, int, Result, Session, Transaction } from 'neo4j-driver';
import { Neo4jConfig } from '../interfaces/config';
import neo4j from 'neo4j-driver'

export interface INeo4jService {
  getReadSession(database?: string): Session
  getWriteSession(database?: string): Session
  beginTransaction(database?: string): Transaction
  read(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Result
  write(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Result
}
@Injectable()
export class Neo4jService implements INeo4jService {
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

  read(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Result {
    if (databaseOrTransaction instanceof String) {
      const session = this.getReadSession(<string>databaseOrTransaction)
      return session.run(cypher, params)
    }

    return (<Transaction>databaseOrTransaction).run(cypher, params)
  }

  write(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Result {
    if (databaseOrTransaction instanceof String) {
      const session = this.getWriteSession(<string>databaseOrTransaction)
      return session.run(cypher, params)
    }

    return (<Transaction>databaseOrTransaction).run(cypher, params)
  }

  onApplicationShutdown() {
    return this.driver.close()
  }
}
