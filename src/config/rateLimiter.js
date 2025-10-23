import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});

export const emailLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
  message: { success: false, message: 'Too many verification requests' },
});

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts, try later' },
  keyGenerator: request => request.body?.email || request.ip,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many registration attempts' },
});

export const changePasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
  message: { success: false, message: 'Too many change password attempts, try later' },
});

export const verifyEmailLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many verify email attempts, try later' },
});

export const createApplicatonLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 2,
  message: { success: false, message: 'Too many create applications attempts, try later' },
});
