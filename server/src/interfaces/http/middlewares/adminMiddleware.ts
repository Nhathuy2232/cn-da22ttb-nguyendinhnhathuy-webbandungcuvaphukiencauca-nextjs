import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền truy cập. Chỉ dành cho Admin' });
  }

  next();
};
