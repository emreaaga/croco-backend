import { userRepository, tokenRepository } from '../repositories/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  constructor({ jwtSecret, refreshSecret }) {
    ((this.jwtSecret = jwtSecret), (this.refreshSecret = refreshSecret));
  }
  async register(validatedData) {
    if (!validatedData) {
      throw new Error('No provided data.');
    }

    const hashedPassword = await this.hashPassword(validatedData.password);
    validatedData.password = hashedPassword;
    const result = await userRepository.create(validatedData);
    return result;
  }
  async login(validatedData) {
    if (!validatedData.email || !validatedData.password || validatedData.password.length < 6) {
      throw new Error('Invalid email or password format');
    }
    const { email, password } = validatedData;

    const [user] = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Incorect email or password');
    } else if (user.status !== 'approved') {
      throw new Error('Wait until admin approve your account');
    }

    const match = await this.comparePasswords(password, user.password);
    if (!match) throw new Error('Incorect email or password');

    const refresh_token = await this.createRefreshToken(user.id);
    const access_token = await this.createAccessToken(user.id, user.email, user.roles);

    return { refresh_token, access_token };
  }
  async getMe(userId) {
    const [user] = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    delete user.password;
    return user;
  }
  async logOut(userId) {
    await tokenRepository.deleteByUserId(userId);
  }
  async changePassword(validatedData, userId) {
    const { old_password, password } = validatedData;
    if (old_password === password) {
      throw new Error('New password cannot be the same as current one.');
    }
    const [user] = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    const match = await this.comparePasswords(old_password, user.password);
    if (!match) throw new Error('Incorect current password');
    const hashedPassword = await this.hashPassword(password);
    await userRepository.updatePassword(user.id, hashedPassword);
  }
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
  async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  async createAccessToken(id, email, role) {
    return jwt.sign({ id, email, role }, this.jwtSecret, {
      expiresIn: '30m',
    });
  }
  async createRefreshToken(id) {
    const refresh_token = jwt.sign({ id }, this.refreshSecret, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tokenRepository.saveRefreshToken(id, refresh_token, expiresAt);

    return refresh_token;
  }
}

export const authService = new AuthService({
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
});
