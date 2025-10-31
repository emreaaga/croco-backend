import { DrizzleQueryError } from 'drizzle-orm';
import { AppError } from '../utils/index.js';

export const globalErrorHandler = (err, request, response, next) => {
  if (err instanceof DrizzleQueryError) {
    console.error('🔥 DB Error caught by global handler:', err?.cause?.message || err.message);
  } else if (!(err instanceof AppError)) {
    console.error('🔥 Error caught by global handler:', err);
  }

  if (err.name === 'TokenExpiredError') {
    return response.status(401).json({ success: false, message: 'Token expired.' });
  }
  if (err.name === 'JsonWebTokenError') {
    return response.status(400).json({ success: false, message: 'Invalid token.' });
  }

  if (err.cause?.code === '23505' && err.cause?.constraint === 'user_email_unique') {
    return response.status(409).json({
      success: false,
      message: 'This email is already registered.',
      code: 'EMAIL_EXISTS',
    });
  }

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ success: false, message: err.message });
  }

  return response.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
