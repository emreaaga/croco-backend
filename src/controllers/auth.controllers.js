import { authService } from '../services/index.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.js';

export const registerController = async (request, response) => {
  const result = await authService.register(request?.validatedData);

  return response.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: result,
  });
};

export const loginController = async (request, response) => {
  const { access_token, refresh_token } = await authService.login(request.validatedData);
  setAuthCookies(response, access_token, refresh_token);

  return response.status(200).json({ success: true, message: 'User logged in successfully.' });
};

export const getMeController = async (request, response) => {
  const user = await authService.getMe(request.userId);
  return response.status(200).json({ success: true, user: user });
};

export const logOutController = async (request, response) => {
  await authService.logOut(request.userId);
  clearAuthCookies(response);
  return response.status(200).json({
    success: 'true',
    message: 'Logged out successfully.',
  });
};

export const changePasswordController = async (request, response) => {
  await authService.changePassword(request.validatedData, request.userId);
  clearAuthCookies(response);

  return response.status(200).json({ success: true, message: 'Password changed!' });
};

export const sendVerificationController = async (request, response) => {
  await authService.sendVerification(request.userId);

  return response.status(200).json({ success: true, message: 'Link sent!' });
};

export const verifyEmailController = async (request, response) => {
  await authService.verifyEmail(request.query?.token);

  return response.status(200).json({ success: true, message: 'Email verified!' });
};

export const refreshTokenController = async (request, response) => {
  const accessToken = await authService.refreshToken(request.cookies?.refresh_token);
  setAuthCookies(response, accessToken, request.cookies?.refresh_token);

  return response.status(200).json({ success: true, message: 'Token refreshed.' });
};
