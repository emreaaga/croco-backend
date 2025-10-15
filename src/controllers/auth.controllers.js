import bcrypt from 'bcrypt';
import { createUser } from '../models/user.model.js';

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
    return response.status(200).json({
      success: true,
      message: 'User loged in successfuly.',
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
