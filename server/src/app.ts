import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import env from './config/env';
import swaggerSpec from './config/swagger';
import routes from './presentation/http/routes';
import { errorHandler, notFoundHandler } from './presentation/http/middlewares/errorHandler';

const app = express();

app.set('trust proxy', true);

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? '*',
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ trangThai: 'hoat_dong', thoiGian: new Date().toISOString() });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Fishing Shop API Documentation',
}));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

