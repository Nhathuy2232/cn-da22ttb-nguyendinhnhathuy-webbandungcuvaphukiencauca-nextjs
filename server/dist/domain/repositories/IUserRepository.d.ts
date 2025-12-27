/**
 * Interface Repository cho User
 * Định nghĩa các phương thức truy xuất dữ liệu người dùng
 */
export type UserRole = 'customer' | 'admin';
export interface User {
    id: number;
    fullName: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserData {
    fullName: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
}
export interface IUserRepository {
    /**
     * Tìm người dùng theo email
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Tìm người dùng theo ID
     */
    findById(id: number): Promise<User | null>;
    /**
     * Tạo người dùng mới
     */
    create(data: CreateUserData): Promise<User>;
    /**
     * Lấy danh sách tất cả người dùng
     */
    list(): Promise<User[]>;
    /**
     * Cập nhật thông tin người dùng
     */
    update(id: number, data: Partial<User>): Promise<boolean>;
    /**
     * Xóa người dùng
     */
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=IUserRepository.d.ts.map