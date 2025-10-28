import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByEmail,
  findUserById,
  changeUserPassword,
  changeUserEmailStatus,
} from '../repositories/user.repository.js';
import { DrizzleQueryError } from 'drizzle-orm';
import { transporter } from '../config/mailer.js';

export const registerController = async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.validatedData.password, 10);
    const data = {
      name: request.validatedData.name,
      email: request.validatedData.email,
      password: hashedPassword,
    };
    const result = await createUser(data);

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
    }
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const loginController = async (request, response) => {
  try {
    const user = await findUserByEmail(request.validatedData.email);
    if (!user.length) {
      return response.status(400).json({
        success: false,
        message: 'Incorect email or password',
      });
    }
    const result = await bcrypt.compare(request.validatedData.password, user[0].password);
    if (!result) {
      return response.status(400).json({
        success: false,
        message: 'Incorect email or password',
      });
    }

    if (user[0].status === 'pending' || user[0].status === 'rejected') {
      return response.status(400).json({
        success: false,
        message: 'Wait until admin approve your account',
      });
    }

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].roles },
      process.env.JWT_SECRET,
      {
        expiresIn: '1m',
      }
    );

    const refresh_token = jwt.sign({ id: user[0].id }, process.env.REFRESH_SECRET, {
      expiresIn: '3d',
    });

    response.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.crocodile-pay.uz' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.crocodile-pay.uz' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return response.status(200).json({
      success: true,
      message: 'User loged in successfully.',
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getMeController = async (request, response) => {
  try {
    const user = await findUserById(request.userId);
    if (!user) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }
    delete user[0].password;
    return response.status(200).json({ success: true, user: user[0] });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error.' });
  }
};

export const logOutController = async (request, response) => {
  try {
    response.clearCookie('access_token', {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.crocodile-pay.uz' : undefined,
    });

    response.clearCookie('refresh_token', {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.crocodile-pay.uz' : undefined,
    });

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
    const { old_password, password } = request.validatedData;

    if (old_password === password) {
      return response
        .status(400)
        .json({ success: false, message: 'New password cannot be the same as current one.' });
    }

    const userId = request.userId;

    const user = await findUserById(userId);

    if (!user.length) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }
    const result = await bcrypt.compare(old_password, user[0].password);

    if (!result) {
      return response.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const new_password = await bcrypt.hash(password, 10);

    await changeUserPassword(userId, new_password);
    response.clearCookie('access_token', {
      httpOnly: true,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.crocodile-pay.uz' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return response.status(200).json({ success: true, message: 'Password changed!' });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

export const sendVerificationController = async (request, response) => {
  try {
    const userId = request.userId;
    const user = await findUserById(userId);
    if (!user.length) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }

    // Нужно еще добавить проверку, а вообще у пользователя подтверждена ли почта

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.EMAIL_SECRET, {
      expiresIn: '5m',
    });

    await transporter.sendMail({
      from: '"Crocodile Pay" <noreply@crocodile-pay.uz>',
      to: user[0].email,
      subject: 'Email verification link',
      html: `<p>Click the link to verify your email:</p>
       <a href="${process.env.VERIFICATION_LINK + token}">Verify Email</a>`,
    });

    return response.status(200).json({ success: true, message: 'Link sent!' });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyEmailController = async (request, response) => {
  try {
    const token = request.query?.token;
    const encoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const user = await findUserById(encoded.id);
    if (!user.length) {
      return response.status(404).json({ success: false, message: 'User not found.' });
    }

    // Нужно еще добавить проверку, а вообще у пользователя подтверждена ли почта

    if (encoded.email !== user[0].email) {
      return response.status(404).json({ success: false, message: 'Incorrect emails' });
    }

    await changeUserEmailStatus(encoded.id);

    return response.status(200).json({ success: true, message: 'Email verified!' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(400).json({ success: false, message: error.message });
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(400).json({ success: false, message: 'Ivalid token' });
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
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET);
    const [user] = await findUserById(decoded.id);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1m',
      }
    );

    response.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
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
