import { UserRole } from '../../infrastructure/repositories/userRepositoryImpl';
export interface AuthTokens {
    accessToken: string;
}
export interface AuthenticatedUser {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
}
declare class AuthService {
    private toUserPayload;
    private generateToken;
    register(input: {
        fullName: string;
        email: string;
        password: string;
    }): Promise<{
        user: AuthenticatedUser;
        tokens: AuthTokens;
    }>;
    login(input: {
        email: string;
        password: string;
    }): Promise<{
        user: AuthenticatedUser;
        tokens: AuthTokens;
    }>;
    me(id: number): Promise<AuthenticatedUser | null>;
}
declare const authService: AuthService;
export default authService;
//# sourceMappingURL=auth.service.d.ts.map