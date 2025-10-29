import { userRepository, tokenRepository } from '../repositories/index.js';
import bcrypt from 'bcrypt';

class AuthService {
  async register(validatedData) {
    if (!validatedData) {
      throw new Error('No provided data.');
    }

    const hashedPassword = await this.hashPassword(validatedData.password);
    validatedData.password = hashedPassword;
    const result = await userRepository.create(validatedData);
    return result;
  }
  async login() {}
  async refreshTokens() {}
  async logout() {}
  async changePassword() {}
  async sendVerificationEmail() {}
  async verifyEmail() {}
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

export const authService = new AuthService();
