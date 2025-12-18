import { NextFunction, Request, Response } from 'express';
import logger from '../../../config/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, 'Unhandled error');
  const unauthMessages = ['Unauthorized', 'Chưa đăng nhập'];
  const status = unauthMessages.includes(err.message) ? 401 : 400;
  res.status(status).json({ message: err.message });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Không tìm thấy đường dẫn' });
};

