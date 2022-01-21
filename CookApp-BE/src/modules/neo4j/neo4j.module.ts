import { DynamicModule, Module } from '@nestjs/common';
import { Neo4jConfig } from './interfaces/config';
import { Neo4jService } from './services/neo4j.service';
import neo4j, { Driver } from 'neo4j-driver'

@Module({})
export class Neo4jModule {
  static forRoot(config: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      providers: [
        {
          provide: 'NEO4J_CONFIG',
          useValue: config
        },
        {
          provide: 'NEO4J_DRIVER',
          useFactory: async (config: Neo4jConfig): Promise<Driver> => {
            const driver = neo4j.driver(
              `${config.scheme}://${config.host}:${config.port}`,
              neo4j.auth.basic(config.username, config.password)
            )
            await driver.verifyConnectivity({ database: config.database })
            return driver
          },
          inject: ['NEO4J_CONFIG']
        },
        {
          provide: "INeo4jService",
          useClass: Neo4jService
        },
      ],
      exports: ["INeo4jService"]
    }
  }
}
