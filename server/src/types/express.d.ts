import type { AuthenticatedUser } from '../modules/auth/auth.service';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends AuthenticatedUser {}

    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};

