import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByEmail,
  findUserById,
  changeUserPassword,
} from '../models/user.model.js';
import { DrizzleQueryError } from 'drizzle-orm';

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
      message: 'User created successfuly.',
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

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    response.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.crocodile-pay.uz' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return response.status(200).json({
      success: true,
      message: 'User loged in successfuly.',
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
