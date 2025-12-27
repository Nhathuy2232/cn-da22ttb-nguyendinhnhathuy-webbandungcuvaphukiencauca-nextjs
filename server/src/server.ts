import http from 'http';
import app from './app';
import env from './config/env';
import logger from './config/logger';
import pool from './infrastructure/database';

const server = http.createServer(app);

const bootstrap = async () => {
  try {
    console.log('Attempting to connect to database...');
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    console.log('Starting HTTP server on port', env.port);
    server.listen(env.port, () => {
      console.log('HTTP server callback executed');
      logger.info(`API server running on http://localhost:${env.port}`);
    });
    console.log('server.listen() called');
  } catch (error) {
    console.error('Error in bootstrap:', error);
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

bootstrap();

