// 🔒 This middleware is currently unused.
// It’s designed for stateful authorization methods (e.g., Bearer tokens in headers).

import jwt from 'jsonwebtoken';

export const authMe = async (request, response, next) => {
  try {
    const header = request.headers.authorization;
    if (!header) {
      return response.status(403).json({ success: false, message: 'No token provided' });
    }
    const token = (header || '').replace(/^Bearer\s*/, '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return response.status(403).json({
      success: false,
      message: 'Invalid token',
    });
  }
};
