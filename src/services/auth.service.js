import bcrypt from 'bcrypt';

import { userRepository, tokenRepository } from '../repositories/index.js';
import { transporter } from '../config/mailer.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/index.js';
import { jwtService } from '../utils/index.js';

class AuthService {
  async register(validatedData) {
    if (!validatedData) throw new BadRequestError('No provided data.');

    const hashedPassword = await this.hashPassword(validatedData.password);
    validatedData.password = hashedPassword;
    const result = await userRepository.create(validatedData);

    return result;
  }
  async login(validatedData) {
    if (!validatedData.email || !validatedData.password || validatedData.password.length < 6) {
      throw new BadRequestError('Invalid email or password format');
    }
    const { email, password } = validatedData;

    const [user] = await userRepository.findByEmail(email);

    if (!user) throw new BadRequestError('Incorect email or password');
    else if (user.status !== 'approved') {
      throw new BadRequestError('Wait until admin approve your account');
    }

    const match = await this.comparePasswords(password, user.password);
    if (!match) throw new BadRequestError('Incorect email or password');

    const refresh_token = jwtService.createRefreshToken(user.id);
    const access_token = jwtService.createAccessToken(user.id, user.email, user.roles);
    console.log(refresh_token);
    console.log(access_token);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tokenRepository.saveRefreshToken(user.id, refresh_token, expiresAt);

    return { refresh_token, access_token };
  }
  async getMe(userId) {
    const [user] = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    delete user.password;
    delete user.is_email_verifed;
    return user;
  }
  async logOut(userId) {
    await tokenRepository.deleteByUserId(userId);
  }
  async changePassword(validatedData, userId) {
    const { old_password, password } = validatedData;
    if (old_password === password) {
      throw new BadRequestError('New password cannot be the same as current one.');
    }
    const [user] = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    const match = await this.comparePasswords(old_password, user.password);
    if (!match) throw new BadRequestError('Incorect current password');
    const hashedPassword = await this.hashPassword(password);
    await userRepository.updatePassword(user.id, hashedPassword);
  }
  async sendVerification(userId) {
    const [user] = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    if (user.is_email_verifed) throw new BadRequestError('User email already verified.');

    const token = jwtService.createEmailToken(user.id, user.email);
    const verifyUrl = `${process.env.API_BASE_URL}/auth/verify-email?token=${token}`;

    await transporter.sendMail({
      from: '"Crocodile Pay" <noreply@crocodile-pay.uz>',
      to: user.email,
      subject: 'Email verification link',
      html: `<p>Click the link to verify your email:</p>
       <a href="${verifyUrl}">Verify Email</a>`,
    });
  }
  async verifyEmail(token) {
    const encoded = jwtService.verifyEmail(token);
    const [user] = await userRepository.findById(encoded.id);
    if (!user) throw new NotFoundError('User not found.');
    if (user.is_email_verifed) throw new BadRequestError('User email already verified.');
    if (encoded.email !== user.email) throw new BadRequestError('Incorrect emails');

    await userRepository.updateEmailStatus(user.id);
  }
  async refreshToken(refresh_token) {
    if (!refresh_token) throw new UnauthorizedError('Not authenticated.');
    const payloud = jwtService.verifyRefresh(refresh_token);
    const data = await tokenRepository.findByToken(refresh_token);

    if (!data) throw new NotFoundError('User not found');
    if (data.user_id !== payloud.id) throw new UnauthorizedError('Invalid refresh token owner.');

    if (data.revoked === true) throw new BadRequestError('User doesnt have permission.');

    const access_token = jwtService.createAccessToken(
      data.user.id,
      data.user.email,
      data.user.roles
    );

    return access_token;
  }
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
  async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export const authService = new AuthService();
