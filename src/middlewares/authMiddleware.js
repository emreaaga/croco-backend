import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/index.js';

export const authMiddleware = async (request, response, next) => {
  const token = request.cookies?.access_token;
  if (!token) throw new UnauthorizedError('Not authenticated.');

  try {
    const encoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!encoded?.id) {
      throw new UnauthorizedError('Invalid token payload.');
    }
    request.userId = encoded.id;
    request.userRole = encoded.role;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token expired.');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token.');
    }
    throw new UnauthorizedError('Session expired or invalid.');
  }
};
