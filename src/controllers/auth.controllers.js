import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/user.model.js';

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
    console.log(error);
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

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return response.status(200).json({
      success: true,
      message: 'User loged in successfuly.',
      token,
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
    return response.status(200).json({
      success: true,
      data: {},
      token: '',
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
