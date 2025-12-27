export type UserRole = 'customer' | 'admin';
export interface UserRecord {
    id: number;
    full_name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}
declare class UserRepository {
    findByEmail(email: string): Promise<UserRecord | null>;
    findById(id: number): Promise<UserRecord | null>;
    create(data: {
        fullName: string;
        email: string;
        passwordHash: string;
        role?: UserRole;
    }): Promise<UserRecord>;
    list(): Promise<UserRecord[]>;
}
declare const userRepository: UserRepository;
export default userRepository;
//# sourceMappingURL=userRepositoryImpl.d.ts.map