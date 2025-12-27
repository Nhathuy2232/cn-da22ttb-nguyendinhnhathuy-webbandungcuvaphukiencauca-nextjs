import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../../../config/env';
import { AuthenticatedUser } from '../../../modules/auth/auth.service';
import { UserRole } from '../../../infrastructure/repositories/userRepositoryImpl';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Thiếu thông tin xác thực' });
  }

  const [, token] = header.split(' ');
  if (!token) {
    return res.status(401).json({ message: 'Header xác thực không hợp lệ' });
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret) as AuthenticatedUser;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const authorize =
  (roles: UserRole[] = ['customer', 'admin']) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không đủ quyền truy cập' });
    }

    next();
  };

