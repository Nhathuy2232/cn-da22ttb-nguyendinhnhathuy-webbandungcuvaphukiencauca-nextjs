import { NextFunction, Request, Response } from 'express';
import { AuthenticatedUser } from '../../../modules/auth/auth.service';
import { UserRole } from '../../../infrastructure/repositories/userRepositoryImpl';
export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorize: (roles?: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map