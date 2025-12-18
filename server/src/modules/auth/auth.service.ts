import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env';
import userRepository, { UserRecord, UserRole } from '../../infrastructure/repositories/userRepository';

export interface AuthTokens {
  accessToken: string;
}

export interface AuthenticatedUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}

class AuthService {
  private toUserPayload(user: UserRecord): AuthenticatedUser {
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    };
  }

  private generateToken(user: UserRecord): AuthTokens {
    const payload = this.toUserPayload(user);
    const accessToken = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
    return { accessToken };
  }

  async register(input: { fullName: string; email: string; password: string }): Promise<{
    user: AuthenticatedUser;
    tokens: AuthTokens;
  }> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('Email đã được đăng ký');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
    });

    return { user: this.toUserPayload(user), tokens: this.generateToken(user) };
  }

  async login(input: { email: string; password: string }): Promise<{
    user: AuthenticatedUser;
    tokens: AuthTokens;
  }> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Thông tin đăng nhập không chính xác');
    }

    const isMatch = await bcrypt.compare(input.password, user.password_hash);
    if (!isMatch) {
      throw new Error('Thông tin đăng nhập không chính xác');
    }

    return { user: this.toUserPayload(user), tokens: this.generateToken(user) };
  }

  async me(id: number): Promise<AuthenticatedUser | null> {
    const user = await userRepository.findById(id);
    return user ? this.toUserPayload(user) : null;
  }
}

const authService = new AuthService();

export default authService;

