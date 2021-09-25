/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as dotenv from 'dotenv';
import './src/boilerplate.polyfill';
import { SnakeNamingStrategy } from './src/utils/snake-naming.strategy';



dotenv.config({
    path: `.env`,
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
    process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}
module.exports = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_APP_USER,
    password: process.env.DB_APP_PASS,
    database: process.env.DB_NAME,
    namingStrategy: new SnakeNamingStrategy(),
    entities: ['src/base/entities/*entity.base{.ts,.js}', 'src/modules/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
};
