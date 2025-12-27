/**
 * Use Case: Đăng nhập người dùng
 * Xử lý logic nghiệp vụ cho việc đăng nhập
 */
import { IUserRepository } from '../../domain/repositories/IUserRepository';
export interface LoginDTO {
    email: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    user: {
        id: number;
        fullName: string;
        email: string;
        role: string;
    };
}
export declare class LoginUseCase {
    private userRepository;
    private jwtSecret;
    private jwtExpiresIn;
    constructor(userRepository: IUserRepository, jwtSecret: string, jwtExpiresIn: string | number);
    execute(dto: LoginDTO): Promise<LoginResponse>;
}
//# sourceMappingURL=LoginUseCase.d.ts.map