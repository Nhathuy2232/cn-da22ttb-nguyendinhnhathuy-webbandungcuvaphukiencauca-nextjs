import mysql from 'mysql2/promise';
import env from '../config/env';
import logger from '../config/logger';

const pool = mysql.createPool({
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.database,
  waitForConnections: true,
  connectionLimit: env.database.connectionLimit,
  namedPlaceholders: false,
  charset: 'utf8mb4',
  acquireTimeoutMillis: 60000,
  queryTimeout: 60000,
  connectTimeout: 60000,
} as any);

pool.on('connection', () => {
  logger.debug('MySQL connection established');
});

export type DbPool = typeof pool;

export default pool;

