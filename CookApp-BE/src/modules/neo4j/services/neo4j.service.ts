import { Inject, Injectable } from '@nestjs/common';
import { Driver, session, Session } from 'neo4j-driver';
import { Neo4jConfig } from '../interfaces/config';

export interface INeo4jService {
  getReadSession(database?: string): Session
  getWriteSession(database?: string): Session
}
@Injectable()
export class Neo4jService implements INeo4jService {
  constructor(
    @Inject("NEO4J_DRIVER")
    private driver: Driver,
    @Inject("NEO4J_CONFIG")
    private config: Neo4jConfig
  ) { }
  getReadSession(database?: string): Session {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: session.READ,
    })
  }
  getWriteSession(database?: string): Session {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: session.WRITE,
    })
  }
}
