import jwt from 'jsonwebtoken';
import { DrizzleQueryError } from 'drizzle-orm';
import { userRepository, tokenRepository } from '../repositories/index.js';
import { authService, userService } from '../services/index.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.js';

export const registerController = async (request, response) => {
  try {
    const result = await authService.register(request?.validatedData);

    return response.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: result,
    });
  } catch (error) {
    if (error instanceof DrizzleQueryError && error.cause.code === '23505') {
      return response.status(409).json({
        success: false,
        message: 'This email is already registered. Please sign in.',
        code: 'EMAIL_EXISTS',
      });
    } else if (error.message === 'No provided data.') {
      return response.status(400).json({ success: false, message: error.message });
    }
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const loginController = async (request, response) => {
  try {
    const { access_token, refresh_token } = await authService.login(request.validatedData);
    setAuthCookies(response, access_token, refresh_token);

    return response.status(200).json({ success: true, message: 'User logged in successfully.' });
  } catch (error) {
    if (error.message === 'Invalid email or password format') {
      return response.status(400).json({ success: false, message: error.message });
    } else if (error.message === 'Wait until admin approve your account') {
      return response.status(400).json({ success: false, message: error.message });
    } else if (error.message === 'Incorect email or password') {
      return response.status(400).json({ success: false, message: error.message });
    }
    return response.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMeController = async (request, response) => {
  try {
    const user = await authService.getMe(request.userId);
    return response.status(200).json({ success: true, user: user });
  } catch (error) {
    if (error.message === 'User not found') {
      return response.status(404).json({ success: false, message: error.message });
    }
    return response.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const logOutController = async (request, response) => {
  try {
    await authService.logOut(request.userId);
    clearAuthCookies(response);
    return response.status(200).json({
      success: 'true',
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const changePasswordController = async (request, response) => {
  try {
    await authService.changePassword(request.validatedData, request.userId);
    clearAuthCookies(response);

    return response.status(200).json({ success: true, message: 'Password changed!' });
  } catch (error) {
    if (error.message === 'New password cannot be the same as current one.') {
      return response.status(400).json({ success: false, message: error.message });
    } else if (error.message === '') {
      return response.status(404).json({ success: false, message: error.message });
    } else if (error.message === 'Incorect current password') {
      return response.status(400).json({ success: false, message: error.message });
    }
    return response.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

export const sendVerificationController = async (request, response) => {
  try {
    await authService.sendVerification(request.userId);

    return response.status(200).json({ success: true, message: 'Link sent!' });
  } catch (error) {
    if (error.message === 'User not found') {
      return response.status(404).json({ success: false, message: error.message });
    } else if (error.message === 'User email already verified.') {
      return response.status(400).json({ success: false, message: error.message });
    }
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyEmailController = async (request, response) => {
  try {
    await authService.verifyEmail(request.query?.token);

    return response.status(200).json({ success: true, message: 'Email verified!' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(400).json({ success: false, message: error.message });
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(400).json({ success: false, message: 'Ivalid token' });
    } else if (error.message === 'User not found.') {
      return response.status(404).json({ success: false, message: error.message });
    } else if (error.message === 'User email already verified.') {
      return response.status(400).json({ success: false, message: error.message });
    } else if (error.message === 'Incorrect emails') {
      return response.status(400).json({ success: false, message: error.message });
    }
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error' });
  }
};

export const refreshTokenController = async (request, response) => {
  try {
    const refresh_token = request.cookies?.refresh_token;
    if (!refresh_token) {
      return response.status(400).json({ success: false, message: 'Not authenticated.' });
    }

    const [validToken] = await tokenRepository.findByToken(refresh_token);
    if (!validToken) {
      return response.status(400).json({ success: false, message: 'Invalid refresh token.' });
    }

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET);

    const [user] = await userRepository.findById(decoded.id);
    if (!user) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }

    const access_token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '50m' }
    );
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const new_refresh_token = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
      expiresIn: '7d',
    });

    tokenRepository.saveRefreshToken(user.id, new_refresh_token, expiresAt);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.crocodile-pay.uz' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    response.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.crocodile-pay.uz' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return response.status(200).json({ success: true, message: 'Token refreshed.' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(400).json({ success: false, message: 'Invalid refresh token' });
    } else if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ success: false, message: 'Refresh token expired' });
    }
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error' });
  }
};
