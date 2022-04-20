
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from './src/utils/snakeNaming.strategy';

dotenv.config({
    path: `.env`,
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
    process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

module.exports = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_APP_USER,
    password: process.env.DB_APP_PASS,
    database: process.env.DB_NAME,
    namingStrategy: new SnakeNamingStrategy(),
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    ssl: process.env.APP_ENV === 'production' || 
      process.env.APP_ENV === 'staging' ? { rejectUnauthorized: false } : false
};
