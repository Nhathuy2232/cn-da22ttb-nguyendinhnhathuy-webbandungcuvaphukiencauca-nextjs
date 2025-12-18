import http from 'http';
import app from './app';
import env from './config/env';
import logger from './config/logger';
import pool from './infrastructure/database';

const server = http.createServer(app);

const bootstrap = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    server.listen(env.port, () => {
      logger.info(`API server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

bootstrap();

